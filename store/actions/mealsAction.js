import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Meal from "../../models/Meal";
import { UPDATE_USER_STATS } from "./usersAction";
import * as usersAction from "./usersAction";
import { DEV_MODE } from "../../data/Environment";
import { UnlinkMeals } from "../../common_functions/UnlinkMeals";
import User from "../../models/User";

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
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json",
      );

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

      const takeOnlySome = [];

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
  return async (dispatch, getState) => {
    console.log("Begin createMeal");
    const token = getState().auth.token;
    if (!token) {
      console.log("No token found! Request will fail! Reload App tommy");
    }

    if (DEV_MODE) {
      meal.isTestMangi = true;
    }

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(meal, replacer),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    meal = { ...meal, id: responseData.name };

    console.log("End createMeal");

    dispatch({ type: CREATE_MEAL, meal: meal });

    return responseData.name;
  };
};

export const editMeal = (meal) => {
  return async (dispatch, getState) => {
    console.log("begin edit meal");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals/${meal.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(meal, replacer),
      },
    );

    await HandleResponseError(response);

    console.log("end edit meal");

    dispatch({ type: EDIT_MEAL, meal: meal });
  };
};

export const editLinks = (meal) => {
  return async (dispatch, getState) => {
    console.log("begin edit links");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals/${meal.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          links: meal.links,
        }),
      },
    );

    await HandleResponseError(response);

    console.log("end edit links");

    dispatch({ type: EDIT_LINKS, meal: meal });
  };
};

export const editReactions = (meal) => {
  return async (dispatch, getState) => {
    console.log("begin edit reactions");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals/${meal.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          reactions: meal.reactions,
        }),
      },
    );

    await HandleResponseError(response);

    console.log("end edit reactions");

    dispatch({ type: EDIT_REACTIONS, meal: meal });
  };
};

export const deleteMeal = (meal, user, allMeals) => {
  return async (dispatch, getState) => {
    console.log("begin delete meal");

    if (meal.authorId !== user.id) {
      console.error(
        `Attempting to delete ${meal.title} where ${user.name} is not the author`,
      );
      return;
    }

    //remove all links
    const mealsToRemoveLinks = UnlinkMeals(meal, [], allMeals);
    console.log(mealsToRemoveLinks);
    await Promise.all(
      mealsToRemoveLinks.map(async (item) => {
        await dispatch(editLinks(item));
      }),
    );

    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/meals/${meal.id}.json?auth=${token}`,
      {
        method: "DELETE",
      },
    );
    await HandleResponseError(response);
    if (response.ok) {
      console.log("Successfully deleted meal");
    }

    dispatch({ type: DELETE_MEAL, meal: meal });

    //Remove the meal from the user's list as well
    const editedUser = User(
      user.id,
      user.name,
      user.email,
      user.meals,
      user.firebaseId,
      user.friends,
      user.expoPushToken,
      user.settings,
    );
    editedUser.meals = user.meals.filter((m) => m !== meal.id);
    await dispatch(usersAction.editUser(editedUser));

    console.log("end delete meal");
  };
};
