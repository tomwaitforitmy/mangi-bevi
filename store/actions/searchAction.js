export const SET_SEARCH_TERM = "SET_SEARCH_TERM";

export const setSearchTerm = (term) => {
  return async (dispatch) => {
    dispatch({ type: SET_SEARCH_TERM, term: term });
  };
};
