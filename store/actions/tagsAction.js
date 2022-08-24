import { HandleResponseError } from "../../common_functions/HandleResponseError";
import Tag from "../../models/Tag";

export const DELETE_TAG = "DELETE_TAG";
export const CREATE_TAG = "CREATE_TAG";
export const EDIT_TAG = "EDIT_TAG";
export const SET_TAGS = "SET_TAGS";
export const SET_ADDED_TAGS = "SET_ADDED_TAGS";
export const ADD_TAG = "ADD_TAG";
export const REMOVE_TAG = "REMOVE_TAG";
export const ADD_FILTER_TAG = "ADD_FILTER_TAG";
export const REMOVE_FILTER_TAG = "REMOVE_FILTER_TAG";
export const SET_FILTER_TAGS = "SET_FILTER_TAGS";

export const setAddedTags = (tagIds) => {
  return { type: SET_ADDED_TAGS, tagIds: tagIds };
};

export const addTag = (tag) => {
  return { type: ADD_TAG, tag: tag };
};

export const removeTag = (tag) => {
  return { type: REMOVE_TAG, tag: tag };
};

export const setFilterTags = (tagIds) => {
  console.log("actions setFilterTags" + tagIds);
  return { type: SET_FILTER_TAGS, tagIds: tagIds };
};

export const addFilterTag = (tag) => {
  return { type: ADD_FILTER_TAG, tag: tag };
};

export const removeFilterTag = (tag) => {
  return { type: REMOVE_FILTER_TAG, tag: tag };
};

const compareTags = (a, b) => {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
};

export const fetchTags = () => {
  return async (dispatch) => {
    console.log("Begin fetchTags");
    try {
      const response = await fetch(
        "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/tags.json",
      );

      await HandleResponseError(response);

      const responseData = await response.json();
      const loadedTags = [];

      for (const key in responseData) {
        loadedTags.push(new Tag(responseData[key].title, key));
      }

      //Order alphabetically
      loadedTags.sort(compareTags);

      dispatch({
        type: SET_TAGS,
        tags: loadedTags,
      });
    } catch (error) {
      throw error;
    }
  };
};

const replacer = (key, value) => {
  if (key === "id") {
    return undefined;
  } else {
    return value;
  }
};

export const createTag = (tag) => {
  return async (dispatch, getState) => {
    console.log("Begin createTag");
    const token = getState().auth.token;
    if (!token) {
      console.log("No token found! Request will fail! Reload App tommy");
    }

    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/tags.json?auth=${token}`,
      {
        method: "POST",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(tag, replacer),
      },
    );

    await HandleResponseError(response);

    const responseData = await response.json();

    tag = { ...tag, id: responseData.name };

    console.log("End createTag");

    dispatch({ type: CREATE_TAG, tag: tag });
  };
};

export const editTag = (tag) => {
  return async (dispatch, getState) => {
    console.log("begin edit tag");
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/tags/${tag.id}.json?auth=${token}`,
      {
        method: "PATCH",
        header: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(tag, replacer),
      },
    );

    await HandleResponseError(response);

    console.log("end edit tag");

    dispatch({ type: EDIT_TAG, tag: tag });
  };
};

export const deleteTag = (id) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app/tags/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      },
    );

    await HandleResponseError(response);

    dispatch({ type: DELETE_TAG, id: id });
  };
};
