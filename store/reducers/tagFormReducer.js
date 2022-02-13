export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const ADD_TAG = "ADD_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const CREATE_TAG = "CREATE_TAG";
export const DELETE_TAG = "DELETE_TAG";

export default function tagFormReducer(state, action) {
  if (action.type === ADD_TAG) {
    return {
      ...state,
      addedTags: [...state.addedTags, action.value],
      availableTags: state.availableTags.filter((e) => e !== action.value),
    };
  }

  if (action.type === REMOVE_TAG) {
    return {
      ...state,
      addedTags: state.addedTags.filter((e) => e !== action.value),
      availableTags: [...state.availableTags, action.value],
    };
  }

  if (action.type === CREATE_TAG) {
    return {
      ...state,
      availableTags: [...state.availableTags, action.value],
    };
  }

  if (action.type === DELETE_TAG) {
    return {
      ...state,
      availableTags: state.availableTags.filter((e) => e !== action.value),
    };
  }

  if (action.type === LOADING) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === SUBMITTED) {
    return {
      ...state,
      isLoading: false,
    };
  }

  return state;
}
