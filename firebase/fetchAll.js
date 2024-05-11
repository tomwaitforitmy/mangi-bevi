import * as mealsActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import * as usersActions from "../store/actions/usersAction";

export const fetchAll = async (dispatch) => {
  await dispatch(usersActions.fetchUsers());
  await dispatch(tagActions.fetchTags());
  return await dispatch(mealsActions.fetchMeals());
};

//here we do not generate stats
export const fetchAllNotAuthenticated = async (dispatch) => {
  await dispatch(usersActions.fetchUsers());
  await dispatch(tagActions.fetchTags());
};
