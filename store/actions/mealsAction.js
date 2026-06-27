import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";
import { UPDATE_USER_STATS } from "./usersAction";
import * as usersAction from "./usersAction";
import * as authAction from "./authAction";
import { DEV_MODE } from "../../data/Environment";
import { UnlinkMeals } from "../../common_functions/UnlinkMeals";
import {
  getMealsUrl,
  getMealUrl,
  getPublicMealsUrl,
} from "../../firebase/urls";
import { runOptimisticTransaction } from "../../firebase/optimisticTransaction";
import deleteImages from "../../image_processing/deleteImages";

export const DELETE_MEAL = "DELETE_MEAL";
export const CREATE_MEAL = "CREATE_MEAL";
export const EDIT_MEAL = "EDIT_MEAL";
export const EDIT_LINKS = "EDIT_LINKS";
export const EDIT_REACTIONS = "EDIT_REACTIONS";
export const SET_MEALS = "SET_MEALS";

export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const toggleFavorite = (id) => {
  return { type: TOGGLE_FAVORITE, mealId: id };
};

export const fetchMeals = () => {
  return async (dispatch) => {
    console.log("Begin fetchMeals");
    try {
      const response = await fetch(getPublicMealsUrl());

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push(
          Meal(
            responseData[key].title,
            key,
            responseData[key].primaryImageUrl,
            responseData[key].ingredients,
            responseData[key].steps,
            responseData[key].imageUrls ? responseData[key].imageUrls : [],
            responseData[key].tags ? responseData[key].tags : [],
            responseData[key].rating ? responseData[key].rating : 0,
            responseData[key].authorId ? responseData[key].authorId : "error",
            responseData[key].creationDate
              ? new Date(responseData[key].creationDate).toISOString()
              : "error",
            responseData[key].editorId ? responseData[key].editorId : "error",
            responseData[key].editDate
              ? new Date(responseData[key].editDate).toISOString()
              : "error",
            responseData[key].links ? responseData[key].links : [],
            responseData[key].isTestMangi
              ? responseData[key].isTestMangi
              : false,
            responseData[key].reactions ? responseData[key].reactions : [],
          ),
        );
      }

      //Invert order to show newest
      loadedMeals.reverse();

      dispatch({
        type: SET_MEALS,
        meals: loadedMeals,
      });
      //Update the statistics and the user meals data.
      //This is possible the first time after we received all meals.
      dispatch({
        type: UPDATE_USER_STATS,
        meals: loadedMeals,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
    //do not upload this to firebase
  } else if (key === "isSelected") {
    return undefined;
  } else {
    return value;
  }
};

export const mergeArrays = (current = [], next = []) => {
  if (!Array.isArray(current)) {
    current = [];
  }
  if (!Array.isArray(next)) {
    next = [];
  }

  // If arrays contain primitives, use simple Set-based dedupe preserving order
  const isPrimitive = (v) =>
    v === null || (typeof v !== "object" && typeof v !== "function");
  if (current.length === 0 && next.length === 0) {
    return [];
  }
  if (
    (current.every(isPrimitive) || current.length === 0) &&
    next.every(isPrimitive)
  ) {
    return Array.from(new Set([...current, ...next]));
  }

  // For arrays of objects, dedupe by a stable key (id, authorId) when available,
  // otherwise fall back to JSON stringification. Preserve existing `current` items
  // and append only new items from `next`.
  const keyFor = (item) => {
    if (item == null) {
      return "__null__";
    }
    if (isPrimitive(item)) {
      return `prim:${String(item)}`;
    }
    if (item.id !== undefined) {
      return `id:${item.id}`;
    }
    if (item.authorId !== undefined) {
      return `author:${item.authorId}`;
    }
    try {
      return `json:${JSON.stringify(item)}`;
    } catch (e) {
      return `obj:${String(item)}`;
    }
  };

  const seen = new Set();
  const out = [];

  for (const it of current) {
    const k = keyFor(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }

  for (const it of next) {
    const k = keyFor(it);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(it);
    }
  }

  return out;
};

export const buildMealUpdatePayload = (currentMeal, nextMealEdit) => {
  const payload = {
    ...currentMeal,
    ...nextMealEdit,
    ingredients: mergeArrays(currentMeal.ingredients, nextMealEdit.ingredients),
    steps: mergeArrays(currentMeal.steps, nextMealEdit.steps),
    imageUrls: mergeArrays(currentMeal.imageUrls, nextMealEdit.imageUrls),
    tags: mergeArrays(currentMeal.tags, nextMealEdit.tags),
    links: mergeArrays(currentMeal.links, nextMealEdit.links),
    reactions: mergeArrays(currentMeal.reactions, nextMealEdit.reactions),
  };
  return payload;
};

export const createMeal = (meal) => {
  return async (dispatch) => {
    console.log("Begin createMeal");
    const token = await authAction.getToken();

    if (DEV_MODE) {
      meal.isTestMangi = true;
    }

    const response = await fetch(getMealsUrl(token), {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(meal, replacer),
    });

    await HandleResponseError(response);

    const responseData = await response.json();

    meal = { ...meal, id: responseData.name };

    console.log("End createMeal");

    dispatch({ type: CREATE_MEAL, meal: meal });

    return responseData.name;
  };
};

export const editMeal = (meal) => {
  return async (dispatch) => {
    console.log("begin edit meal");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    const updatedMeal = await runOptimisticTransaction(resourceUrl, (current) =>
      buildMealUpdatePayload(current || {}, meal),
    );

    console.log("end edit meal");

    dispatch({
      type: EDIT_MEAL,
      meal: { ...meal, ...updatedMeal, id: meal.id },
    });
  };
};

export const editLinks = (meal) => {
  return async (dispatch) => {
    console.log("begin edit links");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    const updatedMeal = await runOptimisticTransaction(
      resourceUrl,
      (current) => {
        const currentLinks = current?.links || [];
        return {
          ...current,
          links: mergeArrays(currentLinks, meal.links),
        };
      },
    );

    console.log("end edit links");

    dispatch({
      type: EDIT_LINKS,
      meal: { ...updatedMeal, id: meal.id },
    });
  };
};

export const editReactions = (meal, userId, newReaction) => {
  return async (dispatch) => {
    console.log("begin edit reactions");
    const token = await authAction.getToken();
    const resourceUrl = getMealUrl(meal.id, token);

    try {
      const updatedMeal = await runOptimisticTransaction(
        resourceUrl,
        (current) => {
          const currentReactions = current?.reactions || [];
          const updatedReactions = currentReactions.filter(
            (r) => r.authorId !== userId,
          );
          if (newReaction.emoji !== "") {
            updatedReactions.push(newReaction);
          }

          return {
            ...current,
            reactions: updatedReactions,
          };
        },
      );

      console.log("updated reaction successfully");

      dispatch({
        type: EDIT_REACTIONS,
        meal: { ...updatedMeal, id: meal.id },
      });

      console.log("end of edit reactions");
    } catch (error) {
      console.error("Error editing reactions:", error);
      throw error;
    }
  };
};

export const deleteMeal = (meal, user, allMeals) => {
  return async (dispatch, getState) => {
    console.log("begin delete meal");

    if (!DEV_MODE && meal.authorId !== user.id) {
      console.error(
        `Attempting to delete ${meal.title} where ${user.name} is not the author`,
      );
      return;
    }

    //remove all links
    const mealsToRemoveLinks = UnlinkMeals(meal, [], allMeals);
    console.log("mealsToRemoveLinks", mealsToRemoveLinks);
    await Promise.all(
      mealsToRemoveLinks.map(async (item) => {
        await dispatch(editLinks(item));
      }),
    );

    const imageUploadTarget = getState().features.features.imageUpload;
    await deleteImages(meal.imageUrls, imageUploadTarget);

    const token = await authAction.getToken();
    const response = await fetch(getMealUrl(meal.id, token), {
      method: "DELETE",
    });
    await HandleResponseError(response);
    if (response.ok) {
      console.log("Successfully deleted meal");
    }

    dispatch({ type: DELETE_MEAL, meal: meal });

    //Remove the meal from the user's list as well
    const editedUser = { ...user };
    editedUser.meals = user.meals.filter((m) => m !== meal.id);
    await dispatch(usersAction.editUser(editedUser));

    //todo:
    //Remove mark as cooked entries
    console.log("end delete meal");
    return editedUser;
  };
};
