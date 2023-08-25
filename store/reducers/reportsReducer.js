import { SET_REPORTS, CREATE_REPORT } from "../actions/reportsAction.js";

const initialState = {
  reports: [],
};

const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REPORTS: {
      return {
        ...state,
        reports: action.reports,
      };
    }
    case CREATE_REPORT: {
      return {
        ...state,
        reports: [action.report].concat(state.reports),
      };
    }

    default:
      return state;
  }
};

export default reportsReducer;
