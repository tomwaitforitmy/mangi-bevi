import { SET_CURRENT_TAB_VIEWED } from "../actions/uiAction";

// null means "no pending tab to resume" -- MealDetailScreen falls back to
// its own default (TITLES.INFO) in that case. Never defaults to a real
// tab here: this value is a one-shot signal consumed and cleared by
// whichever screen reads it, not a persistent "last viewed tab" (that
// would leak the tab from one meal's edit session into an unrelated
// meal opened afterward).
const initialState = {
  currentTabViewed: null,
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
