export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const EDIT_EMAIL = "EDIT_EMAIL";
export const EDIT_CONFIRM_EMAIL = "EDIT_CONFIRM_EMAIL";
export const EDIT_PASSWORD = "EDIT_PASSWORD";
export const EDIT_CONFIRM_PASSWORD = "EDIT_CONFIRM_PASSWORD";

export default function loginFormReducer(state, action) {
  if (action.type === EDIT_EMAIL) {
    return {
      ...state,
      email: action.value.trim(),
    };
  }

  if (action.type === EDIT_CONFIRM_EMAIL) {
    return {
      ...state,
      confirmEmail: action.value.trim(),
    };
  }

  if (action.type === EDIT_PASSWORD) {
    return {
      ...state,
      password: action.value.trim(),
    };
  }

  if (action.type === EDIT_CONFIRM_PASSWORD) {
    return {
      ...state,
      confirmPassword: action.value.trim(),
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
