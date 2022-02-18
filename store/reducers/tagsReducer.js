import { TAGS } from "../../data/DummyTags";
import {
  EDIT_TAG,
  SET_TAGS,
  CREATE_TAG,
  DELETE_TAG,
} from "../actions/tagsAction";

const initialState = {
  tags: TAGS,
};

const tagsReducer = (state = initialState, action) => {
  console.log("tagsReducer " + action.type.toString());
  switch (action.type) {
    case SET_TAGS: {
      return {
        ...state,
        tags: action.tags,
      };
    }
    case CREATE_TAG: {
      return {
        ...state,
        tags: [action.tag].concat(state.tags),
      };
    }
    case DELETE_TAG: {
      const tagIndex = state.tags.findIndex((t) => t.id === action.tag.id);
      const updatedTags = [...state.tags];
      updatedTags[tagIndex] = action.tag;

      return {
        ...state,
        tags: updatedTags,
      };
    }

    default:
      return state;
  }
};

export default tagsReducer;
