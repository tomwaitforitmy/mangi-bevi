export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const EDIT_TAG_TITLE = "EDIT_TAG_TITLE";

export default function tagFormReducer(state, action) {
  if (action.type === EDIT_TAG_TITLE) {
    return {
      ...state,
      newTagTitle: action.value.trim(),
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
