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

  const isPrimitiveValue = (v) =>
    v === null || (typeof v !== "object" && typeof v !== "function");

  if (current.length === 0 && next.length === 0) {
    return [];
  }
  if (
    (current.every(isPrimitiveValue) || current.length === 0) &&
    next.every(isPrimitiveValue)
  ) {
    return Array.from(new Set([...current, ...next]));
  }

  const keyFor = (item) => {
    if (item == null) {
      return "__null__";
    }
    if (isPrimitiveValue(item)) {
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

const isPrimitiveValue = (v) =>
  v === null || (typeof v !== "object" && typeof v !== "function");

const itemKey = (item) => {
  if (item == null) {
    return "__null__";
  }
  if (typeof item !== "object") {
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

const itemEquals = (a, b) => {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

/**
 * Three-way merge for arrays (steps, ingredients, tags, links, reactions, imageUrls).
 *
 * - original: state as it was before either side touched it
 * - edited:   local user's version (may have additions/removals/edits)
 * - server:   latest remote version (may have additions/removals/edits)
 *
 * For every item that existed in `original`:
 *  - If both sides removed it, it's gone.
 *  - If only one side removed it and the other left it unchanged, it's gone
 *    (a real removal wins over a no-op).
 *  - If only one side removed it but the other side actually edited it,
 *    the edit survives (an edit elsewhere shouldn't be silently lost to a
 *    stale removal).
 *  - If neither side removed it: unchanged on both -> keep original;
 *    changed on one side only -> keep that side's version; changed on both
 *    sides identically -> keep one copy; changed on both sides differently
 *    -> keep both versions (edited's version first, then server's).
 *
 * Items that are brand new (not present in `original`) are appended after
 * all resolved original-derived items, with locally-added items first and
 * then server-added items.
 */
const mergeThreeWayArrays = (original = [], edited = [], server = []) => {
  const baseOriginal = Array.isArray(original) ? original : [];
  const baseEdited = Array.isArray(edited) ? edited : [];
  const baseServer = Array.isArray(server) ? server : [];

  if (baseOriginal.length === 0) {
    return mergeArrays(baseServer, baseEdited);
  }

  const originalByKey = new Map(
    baseOriginal.map((item) => [itemKey(item), item]),
  );
  const editedByKey = new Map(baseEdited.map((item) => [itemKey(item), item]));
  const serverByKey = new Map(baseServer.map((item) => [itemKey(item), item]));

  const result = [];
  const seen = new Set();
  const addResultItem = (item) => {
    const key = itemKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  };

  // 1. Resolve every item that existed in `original`.
  for (const originalItem of baseOriginal) {
    const key = itemKey(originalItem);
    const editedItem = editedByKey.get(key);
    const serverItem = serverByKey.get(key);

    const editedPresent = editedByKey.has(key);
    const serverPresent = serverByKey.has(key);

    const editedChanged =
      editedPresent && !itemEquals(editedItem, originalItem);
    const serverChanged =
      serverPresent && !itemEquals(serverItem, originalItem);

    if (!editedPresent && !serverPresent) {
      // Both removed it.
      continue;
    }
    if (!editedPresent) {
      // Local removed it; keep only if server actually changed it.
      if (serverChanged) {
        addResultItem(serverItem);
      }
      continue;
    }
    if (!serverPresent) {
      // Server removed it; keep only if local actually changed it.
      if (editedChanged) {
        addResultItem(editedItem);
      }
      continue;
    }
    // Present on both sides.
    if (!editedChanged && !serverChanged) {
      addResultItem(originalItem);
    } else if (editedChanged && !serverChanged) {
      addResultItem(editedItem);
    } else if (!editedChanged && serverChanged) {
      addResultItem(serverItem);
    } else if (itemEquals(editedItem, serverItem)) {
      addResultItem(editedItem);
    } else {
      // Both changed it differently: keep both edits.
      addResultItem(editedItem);
      addResultItem(serverItem);
    }
  }

  // 2. Add brand-new items (not present in original) — edited first, then server.
  for (const item of baseEdited) {
    if (!originalByKey.has(itemKey(item))) {
      addResultItem(item);
    }
  }
  for (const item of baseServer) {
    if (!originalByKey.has(itemKey(item))) {
      addResultItem(item);
    }
  }

  return result;
};

export const threeWayMerge = (
  originalMeal = {},
  editedMeal = {},
  serverMeal = {},
) => {
  const baseOriginal = originalMeal || {};
  const baseEdited = editedMeal || {};
  const baseServer = serverMeal || {};

  const result = {
    ...baseServer,
    ...baseEdited,
    title:
      baseEdited.title !== undefined && baseEdited.title !== baseOriginal.title
        ? baseEdited.title
        : baseServer.title,
    ingredients: mergeThreeWayArrays(
      baseOriginal.ingredients,
      baseEdited.ingredients,
      baseServer.ingredients,
    ),
    steps: mergeThreeWayArrays(
      baseOriginal.steps,
      baseEdited.steps,
      baseServer.steps,
    ),
    imageUrls: mergeThreeWayArrays(
      baseOriginal.imageUrls,
      baseEdited.imageUrls,
      baseServer.imageUrls,
    ),
    tags: mergeThreeWayArrays(
      baseOriginal.tags,
      baseEdited.tags,
      baseServer.tags,
    ),
    links: mergeThreeWayArrays(
      baseOriginal.links,
      baseEdited.links,
      baseServer.links,
    ),
    reactions: mergeThreeWayArrays(
      baseOriginal.reactions,
      baseEdited.reactions,
      baseServer.reactions,
    ),
  };

  return result;
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
