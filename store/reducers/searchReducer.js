import { SET_SEARCH_TERM, SET_SEARCH_USER_TERM } from "../actions/searchAction";

const initialState = {
  searchTerm: null,
  searchUserTerm: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM: {
      return {
        ...state,
        searchTerm: action.term,
      };
    }

    case SET_SEARCH_USER_TERM: {
      return {
        ...state,
        searchUserTerm: action.term,
      };
    }

    default:
      return state;
  }
};

export default searchReducer;
