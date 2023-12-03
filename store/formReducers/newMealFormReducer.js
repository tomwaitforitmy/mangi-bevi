import { TITLES } from "../../constants/TabMenuTitles";

export const CHANGE_TITLE = "CHANGE_TITLE";
export const CHANGE_PRIMARY_IMAGE = "CHANGE_PRIMARY_IMAGE";
export const SUBMITTED = "SUBMITTED";
export const LOADING = "LOADING";
export const ADD_INGREDIENT = "ADD_INGREDIENT";
export const EDIT_INGREDIENT = "EDIT_INGREDIENT";
export const EDIT_STEP = "EDIT_STEP";
export const ADD_STEP = "ADD_STEP";
export const ADD_IMAGE = "ADD_IMAGE";
export const SET_INGREDIENT_VALUE = "SET_INGREDIENT_VALUE";
export const SET_STEP_VALUE = "SET_STEP_VALUE";
export const SET_FIELD = "SET_FIELD";
export const PREPARE_EDIT_INGREDIENT = "PREPARE_EDIT_INGREDIENT";
export const PREPARE_EDIT_STEP = "PREPARE_EDIT_STEP";
export const REMOVE_INGREDIENT = "REMOVE_INGREDIENT";
export const REMOVE_STEP = "REMOVE_STEP";
export const REMOVE_IMAGE = "REMOVE_IMAGE";
export const SHOW_MODAL = "SHOW_MODAL";
export const CHANGE_PAGE_TITLE = "CHANGE_PAGE_TITLE";
export const INGREDIENT_SORT = "INGREDIENT_SORT";
export const STEP_SORT = "STEP_SORT";

export const GetInitialState = (inputMeal, initiallySelectedTab) => {
  return {
    title: inputMeal ? inputMeal.title : "",
    primaryImageUrl: inputMeal ? inputMeal.primaryImageUrl : null,
    ingredients: inputMeal ? inputMeal.ingredients : [],
    steps: inputMeal ? inputMeal.steps : [],
    imageUrls: inputMeal ? inputMeal.imageUrls : [],
    imageUrlsToDelete: [],
    ingredientValue: "",
    stepValue: "",
    isLoading: false,
    ingredientIndex: null,
    stepIndex: null,
    showModal: false,
    newCreatedId: "id-was-not-defined-yet",
    selectedTab: initiallySelectedTab ? initiallySelectedTab : TITLES.INFO,
    ingredientSort: false,
    stepSort: false,
  };
};

export default function newMealFormReducer(state, action) {
  if (action.type === STEP_SORT) {
    return {
      ...state,
      stepSort: action.value,
    };
  }

  if (action.type === INGREDIENT_SORT) {
    return {
      ...state,
      ingredientSort: action.value,
    };
  }

  if (action.type === CHANGE_PAGE_TITLE) {
    return {
      ...state,
      selectedTab: action.value,
    };
  }

  if (action.type === SHOW_MODAL) {
    return {
      ...state,
      showModal: true,
      newCreatedId: action.value,
      isLoading: false,
    };
  }

  if (action.type === SET_FIELD) {
    return {
      ...state,
      [action.field]: action.value,
    };
  }

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
    if (!state.primaryImageUrl) {
      return {
        ...state,
        primaryImageUrl: action.value,
        imageUrls: [...state.imageUrls, action.value],
      };
    }

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

  if (action.type === EDIT_INGREDIENT) {
    if (
      state.ingredients.includes(action.value) ||
      state.ingredientIndex === null
    ) {
      action.ref.current.clear();
      return state;
    } else {
      action.ref.current.clear();
      action.ref.current.focus();
      //In case of an empty value, we like to remove
      if (action.value === "") {
        return {
          ...state,
          ingredients: state.ingredients.filter(
            (_, i) => i !== state.ingredientIndex,
          ),
          ingredientValue: "",
          ingredientIndex: null,
        };
      }
      const editedIngredients = state.ingredients;
      editedIngredients[state.ingredientIndex] = action.value;
      return {
        ...state,
        ingredients: editedIngredients,
        ingredientValue: "",
        ingredientIndex: null,
      };
    }
  }

  if (action.type === EDIT_STEP) {
    if (state.steps.includes(action.value) || state.stepIndex === null) {
      action.ref.current.clear();
      return state;
    } else {
      action.ref.current.clear();
      action.ref.current.focus();
      //In case of an empty value, we like to remove
      if (action.value === "") {
        return {
          ...state,
          steps: state.steps.filter((_, i) => i !== state.stepIndex),
          stepValue: "",
          stepIndex: null,
        };
      }
      const editedSteps = state.steps;
      editedSteps[state.stepIndex] = action.value;
      return {
        ...state,
        steps: editedSteps,
        stepValue: "",
        stepIndex: null,
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

  if (action.type === PREPARE_EDIT_INGREDIENT) {
    const element = state.ingredients.filter((e) => e === action.key);
    const elementIndex = state.ingredients.findIndex((e) => e === action.key);
    action.ref.current.setNativeProps({
      text: element.toString(),
    });
    action.ref.current.focus();

    return {
      ...state,
      ingredientValue: element,
      ingredientIndex: elementIndex,
    };
  }

  if (action.type === PREPARE_EDIT_STEP) {
    const element = state.steps.filter((e) => e === action.key);
    const elementIndex = state.steps.findIndex((e) => e === action.key);
    action.ref.current.setNativeProps({
      text: element.toString(),
    });
    action.ref.current.focus();

    return {
      ...state,
      stepValue: element,
      stepIndex: elementIndex,
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
      (url, index) => url !== action.value, //just keeping index here to remind me how it works
    );

    //no image left, return default values
    if (newImageUrls.length === 0) {
      return {
        ...state,
        primaryImageUrl: null,
        imageUrls: [],
        imageUrlsToDelete: [...state.imageUrlsToDelete, action.value],
      };
    }

    //primary image was not deleted, we can keep it
    if (newImageUrls.includes(state.primaryImageUrl)) {
      return {
        ...state,
        imageUrls: newImageUrls,
        imageUrlsToDelete: [...state.imageUrlsToDelete, action.value],
      };
    } else {
      //make first available image the primary
      return {
        ...state,
        imageUrls: newImageUrls,
        primaryImageUrl: newImageUrls[0],
        imageUrlsToDelete: [...state.imageUrlsToDelete, action.value],
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
    return GetInitialState(null, null);
  }

  return state;
}
