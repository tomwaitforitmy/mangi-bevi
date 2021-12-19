export const CHANGE_TITLE = "CHANGE_TITLE";
export const CHANGE_PRIMARY_IMAGE = "CHANGE_PRIMARY_IMAGE";
export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const ADD_STEP = "ADD_STEP";
export const ADD_IMAGE = "ADD_IMAGE";
export const SET_INGREDIENT_VALUE = "SET_INGREDIENT_VALUE";
export const SET_STEP_VALUE = "SET_STEP_VALUE";
export const REMOVE_INGREDIENT = "REMOVE_INGREDIENT";
export const REMOVE_STEP = "REMOVE_STEP";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

export default function newMealFormReducer(state, action) {
  if (action.type === CHANGE_TITLE) {
    return {
      ...state,
      title: action.value,
    };
  }

  if (action.type === CHANGE_PRIMARY_IMAGE) {
    return {
      ...state,
      primaryImageUrl: action.value,
    };
  }

  if (action.type === ADD_IMAGE) {
    return {
      ...state,
      imageUrls: [...state.imageUrls, action.value],
    };
  }

  if (action.type === ADD_INGREDIENT) {
    if (state.ingredients.includes(action.value) || action.value === "") {
      action.ref.current.clear();
      return state;
    } else {
      action.ref.current.clear();
      action.ref.current.focus();
      return {
        ...state,
        ingredients: [...state.ingredients, action.value],
        ingredientValue: "",
      };
    }
  }

  if (action.type === ADD_STEP) {
    if (state.steps.includes(action.value) || action.value === "") {
      action.ref.current.clear();
      return state;
    } else {
      action.ref.current.clear();
      action.ref.current.focus();
      return {
        ...state,
        steps: [...state.steps, action.value],
        stepValue: "",
      };
    }
  }

  if (action.type === SET_STEP_VALUE) {
    return {
      ...state,
      stepValue: action.value,
    };
  }

  if (action.type === SET_INGREDIENT_VALUE) {
    return {
      ...state,
      ingredientValue: action.value,
    };
  }

  if (action.type === REMOVE_STEP) {
    return {
      ...state,
      steps: state.steps.filter((e) => e !== action.key),
    };
  }

  if (action.type === REMOVE_INGREDIENT) {
    return {
      ...state,
      ingredients: state.ingredients.filter((e) => e !== action.key),
    };
  }

  if (action.type === REMOVE_IMAGE) {
    const newImageUrls = state.imageUrls.filter(
      (url, index) => index !== action.key
    );

    //no image left, return default values
    if (newImageUrls.length === 0) {
      return {
        ...state,
        primaryImageUrl: null,
        imageUrls: [],
      };
    }

    //primary image was not deleted, we can keep it
    if (newImageUrls.includes(state.primaryImageUrl)) {
      return {
        ...state,
        imageUrls: newImageUrls,
      };
    } else {
      //make first available image the primary
      return {
        ...state,
        imageUrls: newImageUrls,
        primaryImageUrl: newImageUrls[0],
      };
    }
  }

  if (action.type === LOADING) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === SUBMITTED) {
    return {
      title: "",
      primaryImageUrl: null,
      ingredients: [],
      steps: [],
      ingredientValue: "",
      stepValue: "",
      imageUrls: [],
      isLoading: false,
    };
  }

  return state;
}
