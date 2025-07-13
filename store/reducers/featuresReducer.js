import { SET_FEATURES } from "../actions/featuresAction.js";

const initialState = {
  features: [],
};

const featuresReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FEATURES: {
      return {
        ...state,
        features: action.features,
      };
    }

    default:
      return state;
  }
};

export default featuresReducer;
