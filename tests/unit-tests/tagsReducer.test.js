// tagsReducer.js imports its action-type constants from tagsAction.js,
// which imports firebase/urls -> firebase/firebase (initializes the real
// Firebase SDK on import) and store/actions/authAction -- mock those out,
// same approach as mealsAction.threeWayMerge.test.js, so this pure reducer
// test doesn't need real Firebase config.
jest.mock("../../firebase/urls", () => ({
  getTagsUrl: jest.fn(),
  getTagUrl: jest.fn(),
}));
jest.mock("../../firebase/optimisticTransaction", () => ({
  runOptimisticTransaction: jest.fn(),
}));
jest.mock("../../store/actions/authAction", () => ({
  getToken: jest.fn(),
}));

import tagsReducer from "../../store/reducers/tagsReducer";
import { CREATE_TAG, DELETE_TAG } from "../../store/actions/tagsAction";
import Tag from "../../models/Tag";

describe("tagsReducer DELETE_TAG", () => {
  it("also removes the tag from filterTags and availableFilterTags", () => {
    const tag = Tag("Vegan", "tag-1");
    const otherTag = Tag("Spicy", "tag-2");

    const state = {
      tags: [tag, otherTag],
      availableTags: [otherTag],
      addedTags: [tag],
      filterTags: [tag],
      availableFilterTags: [otherTag],
      tagsLoaded: true,
    };

    const result = tagsReducer(state, { type: DELETE_TAG, id: tag.id });

    expect(result.tags).toEqual([otherTag]);
    expect(result.addedTags).toEqual([]);
    expect(result.filterTags).toEqual([]);
    expect(result.availableFilterTags).toEqual([otherTag]);
  });
});

describe("tagsReducer CREATE_TAG", () => {
  it("also adds the new tag to availableFilterTags", () => {
    const existingTag = Tag("Vegan", "tag-1");
    const newTag = Tag("Spicy", "tag-2");

    const state = {
      tags: [existingTag],
      availableTags: [existingTag],
      addedTags: [],
      filterTags: [],
      availableFilterTags: [existingTag],
      tagsLoaded: true,
    };

    const result = tagsReducer(state, { type: CREATE_TAG, tag: newTag });

    expect(result.tags).toEqual([existingTag, newTag]);
    expect(result.availableTags).toEqual([existingTag, newTag]);
    expect(result.availableFilterTags).toEqual([existingTag, newTag]);
  });
});
