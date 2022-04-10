export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const SET_EMAIL_ERROR = "SET_EMAIL_ERROR";
export const SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR";
export const SET_CONFIRM_EMAIL_ERROR = "SET_CONFIRM_EMAIL_ERROR";
export const SET_CONFIRM_PASSWORD_ERROR = "SET_CONFIRM_PASSWORD_ERROR";
export const EDIT_FIELD = "EDIT_FIELD";

export default function loginFormReducer(state, action) {
  if (action.type === SET_EMAIL_ERROR) {
    return {
      ...state,
      emailError: action.error,
    };
  }

  if (action.type === SET_PASSWORD_ERROR) {
    return {
      ...state,
      passwordError: action.error,
    };
  }

  if (action.type === SET_CONFIRM_EMAIL_ERROR) {
    return {
      ...state,
      confirmEmailError: action.error,
    };
  }

  if (action.type === SET_CONFIRM_PASSWORD_ERROR) {
    return {
      ...state,
      confirmPasswordError: action.error,
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
