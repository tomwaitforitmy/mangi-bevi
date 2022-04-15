export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const SET_FIELD_ERROR = "SET_FIELD_ERROR";
export const EDIT_FIELD = "EDIT_FIELD";

export default function loginFormReducer(state, action) {
  if (action.type === SET_FIELD_ERROR) {
    return {
      ...state,
      [action.field + "Error"]: action.error,
    };
  }

  if (action.type === EDIT_FIELD) {
    return {
      ...state,
      [action.field]: action.value.trim(),
      [action.field + "Error"]: "",
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
