export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const SET_EMAIL_ERROR = "SET_EMAIL_ERROR";
export const SET_PASSWORD_ERROR = "SET_PASSWORD_ERROR";
export const SET_CONFIRM_EMAIL_ERROR = "SET_CONFIRM_EMAIL_ERROR";
export const SET_CONFIRM_PASSWORD_ERROR = "SET_CONFIRM_PASSWORD_ERROR";
export const EDIT_EMAIL = "EDIT_EMAIL";
export const EDIT_CONFIRM_EMAIL = "EDIT_CONFIRM_EMAIL";
export const EDIT_PASSWORD = "EDIT_PASSWORD";
export const EDIT_CONFIRM_PASSWORD = "EDIT_CONFIRM_PASSWORD";

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

  if (action.type === EDIT_EMAIL) {
    return {
      ...state,
      email: action.value.trim(),
      emailError: "",
    };
  }

  if (action.type === EDIT_CONFIRM_EMAIL) {
    return {
      ...state,
      confirmEmail: action.value.trim(),
      confirmEmailError: "",
    };
  }

  if (action.type === EDIT_PASSWORD) {
    return {
      ...state,
      password: action.value.trim(),
      passwordError: "",
    };
  }

  if (action.type === EDIT_CONFIRM_PASSWORD) {
    return {
      ...state,
      confirmPassword: action.value.trim(),
      confirmPasswordError: "",
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
