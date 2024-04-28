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
  ADD_FILTER_TAG,
  REMOVE_FILTER_TAG,
  SET_FILTER_TAGS,
  FILTER_MODE_OR,
  FILTER_MODE_AND,
} from "../actions/tagsAction";

const initialState = {
  tags: TAGS,
  availableTags: TAGS,
  addedTags: [],
  filterTags: [],
  filterMode: FILTER_MODE_OR,
  availableFilterTags: [],
};

const tagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_MODE_AND: {
      return {
        ...state,
        filterMode: FILTER_MODE_AND,
      };
    }
    case FILTER_MODE_OR: {
      return {
        ...state,
        filterMode: FILTER_MODE_OR,
      };
    }
    case ADD_TAG: {
      return {
        ...state,
        addedTags: [...state.addedTags, action.tag],
        availableTags: state.availableTags.filter(
          (e) => e.id !== action.tag.id,
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
        if (found) {
          addedTags.push(found);
        }
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
    case ADD_FILTER_TAG: {
      return {
        ...state,
        filterTags: [...state.filterTags, action.tag],
        availableFilterTags: state.availableFilterTags.filter(
          (e) => e.id !== action.tag.id,
        ),
      };
    }
    case REMOVE_FILTER_TAG: {
      return {
        ...state,
        filterTags: state.filterTags.filter((e) => e.id !== action.tag.id),
        availableFilterTags: [...state.availableFilterTags, action.tag],
      };
    }
    case SET_FILTER_TAGS: {
      const filterTags = [];

      action.tagIds.map((tagId) => {
        const found = state.tags.find((tag) => tag.id === tagId);
        if (found) {
          filterTags.push(found);
        }
      });

      const availableFilterTags = state.tags.filter((tag) => {
        return !filterTags.some((toFilterTag) => {
          return toFilterTag.title === tag.title;
        });
      });

      return {
        ...state,
        filterTags: filterTags,
        availableFilterTags: availableFilterTags,
      };
    }
    case SET_TAGS: {
      return {
        ...state,
        tags: action.tags,
      };
    }
    case CREATE_TAG: {
      const newTag = Tag(action.tag.title, action.tag.id);

      return {
        ...state,
        tags: state.tags.concat(newTag),
        availableTags: state.availableTags.concat(newTag),
      };
    }
    case DELETE_TAG: {
      const deleteId = action.id;

      return {
        ...state,
        tags: state.tags.filter((t) => t.id !== deleteId),
        availableTags: state.availableTags.filter((t) => t.id !== deleteId),
        addedTags: state.addedTags.filter((t) => t.id !== deleteId),
      };
    }

    default:
      return state;
  }
};

export default tagsReducer;
