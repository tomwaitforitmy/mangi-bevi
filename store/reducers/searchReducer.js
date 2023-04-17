import { SET_SEARCH_TERM } from "../actions/searchAction";

const initialState = {
  searchTerm: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM: {
      console.log("SET_SEARCH_TERM " + action.term);

      return {
        ...state,
        searchTerm: action.term,
      };
    }

    default:
      return state;
  }
};

export default searchReducer;
