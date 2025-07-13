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

export const createMeal = (meal) => {
  return async (dispatch) => {
    console.log("Begin createMeal");
    const token = await authAction.getToken();

    if (DEV_MODE) {
      meal.isTestMangi = true;
    }

    const response = await fetch(getMealsUrl(token), {
      method: "POST",
      header: {
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
    const response = await fetch(getMealUrl(meal.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(meal, replacer),
    });

    await HandleResponseError(response);

    console.log("end edit meal");

    dispatch({ type: EDIT_MEAL, meal: meal });
  };
};

export const editLinks = (meal) => {
  return async (dispatch) => {
    console.log("begin edit links");
    const token = await authAction.getToken();
    const response = await fetch(getMealUrl(meal.id, token), {
      method: "PATCH",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        links: meal.links,
      }),
    });

    await HandleResponseError(response);

    console.log("end edit links");

    dispatch({ type: EDIT_LINKS, meal: meal });
  };
};

export const editReactions = (meal, userId, newReaction) => {
  return async (dispatch) => {
    console.log("begin edit reactions");
    const token = await authAction.getToken();
    const url = getMealUrl(meal.id, token);

    try {
      // Start transaction to prevent overwrites
      const response = await fetch(url);
      await HandleResponseError(response);

      const currentReactions = (await response.json()).reactions || [];

      // Update or add the user's reaction
      const updatedReactions = currentReactions.filter(
        (r) => r.authorId !== userId,
      );
      if (newReaction.emoji !== "") {
        updatedReactions.push(newReaction);
      }

      // Save the merged reactions back to Firebase
      const updateResponse = await fetch(url, {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reactions: updatedReactions,
        }),
      });

      await HandleResponseError(updateResponse);
      if (updateResponse.ok) {
        console.log("updated reaction successfully");
      }

      dispatch({
        type: EDIT_REACTIONS,
        meal: { ...meal, reactions: updatedReactions },
      });

      console.log("end of edit reactions");
    } catch (error) {
      console.error("Error editing reactions:", error);
      throw error;
    }
  };
};

export const deleteMeal = (meal, user, allMeals) => {
  return async (dispatch) => {
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
    //delete images
    //Remove mark as cooked entries
    console.log("end delete meal");
    return editedUser;
  };
};
