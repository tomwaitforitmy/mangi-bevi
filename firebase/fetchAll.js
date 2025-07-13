import * as mealsActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import * as usersActions from "../store/actions/usersAction";
import * as featuresActions from "../store/actions/featuresAction";

export const fetchAll = async (dispatch) => {
  await dispatch(featuresActions.fetchFeatures());
  await dispatch(usersActions.fetchUsers());
  await dispatch(tagActions.fetchTags());
  return await dispatch(mealsActions.fetchMeals());
};

export const fetchAllUnauthenticated = async (dispatch) => {
  await dispatch(featuresActions.fetchFeatures());
  return await dispatch(mealsActions.fetchMeals());
};
