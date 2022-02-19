export const ADD_TAG = "ADD_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const CLOSE = "CLOSE";
export const OPEN = "OPEN";
export const ADD_RATING = "ADD_RATING";

export default function mealSpeedDialReducer(state, action) {
  if (action.type === ADD_TAG) {
    return {
      ...state,
      tags: [...state.tags, action.value],
    };
  }

  if (action.type === REMOVE_TAG) {
    return {
      ...state,
      tags: state.tags.filter((e) => e !== action.key),
    };
  }

  if (action.type === OPEN) {
    return {
      ...state,
      isOpen: true,
    };
  }

  if (action.type === CLOSE) {
    return {
      ...state,
      isOpen: false,
    };
  }

  return state;
}
