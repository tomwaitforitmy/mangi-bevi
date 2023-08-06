export const SET_SEARCH_TERM = "SET_SEARCH_TERM";
export const SET_SEARCH_USER_TERM = "SET_SEARCH_USER_TERM";

export const setSearchTerm = (term) => {
  return async (dispatch) => {
    dispatch({ type: SET_SEARCH_TERM, term: term });
  };
};

export const setSearchUserTerm = (term) => {
  return async (dispatch) => {
    dispatch({ type: SET_SEARCH_USER_TERM, term: term });
  };
};
