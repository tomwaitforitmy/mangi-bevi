import { HandleResponseError } from "../../common_functions/HandleResponseError";
import { getPublicFeaturesUrl } from "../../firebase/urls";

export const SET_FEATURES = "SET_FEATURES";

export const fetchFeatures = () => {
  return async (dispatch) => {
    console.log("Begin fetch feature flags");
    try {
      const response = await fetch(getPublicFeaturesUrl());

      await HandleResponseError(response);

      const responseData = await response.json();

      dispatch({
        type: SET_FEATURES,
        features: responseData,
      });
    } catch (error) {
      throw error;
    }
  };
};
