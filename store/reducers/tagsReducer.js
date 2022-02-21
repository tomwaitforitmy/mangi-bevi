import { TAGS } from "../../data/DummyTags";
import Tag from "../../models/Tag";
import {
  EDIT_TAG,
  SET_TAGS,
  SET_ADDED_TAGS,
  CREATE_TAG,
  DELETE_TAG,
  ADD_TAG,
  REMOVE_TAG,
} from "../actions/tagsAction";

const initialState = {
  tags: TAGS,
  availableTags: TAGS,
  addedTags: [],
};

const tagsReducer = (state = initialState, action) => {
  console.log("tagsReducer " + action.type.toString());
  switch (action.type) {
    case ADD_TAG: {
      return {
        ...state,
        addedTags: [...state.addedTags, action.tag],
        availableTags: state.availableTags.filter(
          (e) => e.id !== action.tag.id
        ),
      };
    }
    case REMOVE_TAG: {
      return {
        ...state,
        addedTags: state.addedTags.filter((e) => e.id !== action.tag.id),
        availableTags: [...state.availableTags, action.tag],
      };
    }
    case SET_ADDED_TAGS: {
      const addedTags = [];

      action.tagIds.map((tagId) => {
        const found = state.tags.find((tag) => tag.id === tagId);
        addedTags.push(found);
      });

      const availableTags = state.tags.filter((tag) => {
        return !addedTags.some((toFilterTag) => {
          return toFilterTag.title === tag.title;
        });
      });

      return {
        ...state,
        addedTags: addedTags,
        availableTags: availableTags,
      };
    }
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
        availableTags: state.availableTags.concat(newTag),
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
