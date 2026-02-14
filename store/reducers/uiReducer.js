import { SET_CURRENT_TAB_VIEWED } from "../actions/uiAction";
import { TITLES } from "../../constants/TabMenuTitles";

const initialState = {
  currentTabViewed: TITLES.INFO,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_TAB_VIEWED: {
      return {
        ...state,
        currentTabViewed: action.tab,
      };
    }

    default:
      return state;
  }
};

export default uiReducer;
