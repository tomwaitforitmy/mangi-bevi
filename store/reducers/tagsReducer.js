import { TAGS } from "../../data/DummyTags";
import Tag from "../../models/Tag";
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
      const newTag = new Tag(action.tag.title, action.tag.id);

      return {
        ...state,
        tags: state.tags.concat(newTag),
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
