import * as mealsActions from "../store/actions/mealsAction";
import * as tagActions from "../store/actions/tagsAction";
import * as usersActions from "../store/actions/usersAction";

export const fetchAll = async (dispatch) => {
  dispatch(usersActions.fetchUsers()).then(() => {
    dispatch(mealsActions.fetchMeals()).then(() => {
      return dispatch(tagActions.fetchTags());
    });
  });
};
