describe("mealsAction three-way merge (original, edited, server)", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("../../common_functions/HandleResponseError", () => ({
      HandleResponseError: jest.fn(async () => true),
    }));
    jest.doMock("../../models/Meal", () => () => ({}));
    jest.doMock("../../store/actions/authAction", () => ({
      getToken: jest.fn(async () => "token"),
    }));
    jest.doMock("../../data/Environment", () => ({ DEV_MODE: false }));
    jest.doMock("../../firebase/urls", () => ({
      getMealsUrl: jest.fn(() => "https://example.com/meals.json?auth=token"),
      getMealUrl: jest.fn(
        (id) => `https://example.com/meals/${id}.json?auth=token`,
      ),
      getPublicMealsUrl: jest.fn(() => "https://example.com/meals.json"),
    }));
    jest.doMock("../../firebase/firebase", () => ({
      firebaseAuth: { currentUser: null },
    }));
    jest.doMock("../../image_processing/deleteImages", () =>
      jest.fn(async () => true),
    );
  });

  const loadHelpers = () => require("../../store/actions/mealsAction");

  it("User adds a reaction, original author edits the meal meanwhile", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u1", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      // user added a reaction locally
      reactions: [
        { authorId: "u1", emoji: "👍" },
        { authorId: "u2", emoji: "❤️" },
      ],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Edited by remote",
      links: ["link-A"],
      reactions: [{ authorId: "u1", emoji: "👍" }],
      //second step was added remotely
      steps: ["step1", "step2"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Edited by remote");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([
      { authorId: "u1", emoji: "👍" },
      { authorId: "u2", emoji: "❤️" },
    ]);
    expect(merged.steps).toEqual(["step1", "step2"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("User 2 removes a reaction, user 1 edits the meal meanwhile", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      // user removed a reaction locally
      reactions: [],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Edited by remote",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      //second step was added remotely
      steps: ["step1", "step2"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Edited by remote");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([]); // user 2 removed their reaction, so it should be gone
    expect(merged.steps).toEqual(["step1", "step2"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("localState equals serverFetched. Just apply edits.", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Edited title",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1", "step2"],
      ingredients: ["ingredient1", "ingredient2"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Edited title");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u2", emoji: "👍" }]);
    expect(merged.steps).toEqual(["step1", "step2"]);
    expect(merged.ingredients).toEqual(["ingredient1", "ingredient2"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("User 1 added a tag and user 2 removed a tag.", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1", "tag2"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: [],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Original");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u2", emoji: "👍" }]);
    expect(merged.steps).toEqual(["step1"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag2"]); // user 1 added tag2, user 2 removed tag1, so only tag2 remains
  });

  it("User 1 removed a step and user 2 another step.", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1", "step2", "step3"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1", "step3"], // user 1 removed step2
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1", "step2"], // user 2 removed step3
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Original");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u2", emoji: "👍" }]);
    expect(merged.steps).toEqual(["step1"]); // both users removed different steps, so only step1 remains
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("Both edit the same step.", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: "],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: Start with garlic and onions"], // user 1 edited
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: Take the garlic and onions"], // user 2 edited
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Original");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u2", emoji: "👍" }]);
    expect(merged.steps).toEqual([
      "Prepare the ingredients: Take the garlic and onions",
      "Prepare the ingredients: Start with garlic and onions",
    ]); // both users edited the same step, so both edits are taken
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("Both user 1 adds a reaction, user 2 edits his", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: "],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "😍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [
        { authorId: "u2", emoji: "👍" },
        { authorId: "u1", emoji: "👍" },
      ],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Original");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([
      { authorId: "u2", emoji: "😍" },
      { authorId: "u1", emoji: "👍" },
    ]);
    expect(merged.steps).toEqual(["step1"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  it("Both add tags", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: "],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u1", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1", "tag2", "tag3"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u1", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1", "tag2", "tag4"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Original");
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u1", emoji: "👍" }]);
    expect(merged.steps).toEqual(["step1"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1", "tag2", "tag3", "tag4"]); // both users added different tags, so all unique tags are included
  });

  it("Both edit the title, last one wins", () => {
    const localState = {
      id: "meal1",
      title: "Original",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["Prepare the ingredients: "],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const editedLocal = {
      id: "meal1",
      title: "Edited by user 2",
      links: ["link-A"],
      reactions: [{ authorId: "u2", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const serverFetched = {
      id: "meal1",
      title: "Edited by user 1",
      links: ["link-A"],
      reactions: [{ authorId: "u1", emoji: "👍" }],
      steps: ["step1"],
      ingredients: ["ingredient1"],
      tags: ["tag1"],
    };

    const { threeWayMerge } = loadHelpers();
    const merged = threeWayMerge(localState, editedLocal, serverFetched);
    expect(merged.title).toEqual("Edited by user 2"); // last edit wins
    expect(merged.links).toEqual(["link-A"]);
    expect(merged.reactions).toEqual([{ authorId: "u1", emoji: "👍" }]);
    expect(merged.steps).toEqual(["step1"]);
    expect(merged.ingredients).toEqual(["ingredient1"]);
    expect(merged.tags).toEqual(["tag1"]);
  });

  // Regression: a same-editor, no-concurrent-change reorder (e.g. dragging
  // steps/ingredients in NewScreen's sort mode, then saving) must round-trip
  // through the merge exactly as reordered. mergeThreeWayPrimitiveArray's
  // main loop used to emit a matched slot's item before the gap of
  // unmatched/inserted items that belongs immediately in front of it, for
  // the same loop index -- backwards from what "gap sits before this slot"
  // requires. A full-list reversal's only gap happens to fall at the very
  // end (nothing after it to misorder against), which is why that case
  // alone looked fine; any reorder with an interior gap -- a single-item
  // rotation, an adjacent swap, a shuffle -- came out scrambled.
  describe("reordering (no concurrent change)", () => {
    const scenarios = [
      ["full reversal", ["1", "2", "3", "4", "5"], ["5", "4", "3", "2", "1"]],
      ["rotate left by one", ["1", "2", "3", "4", "5"], ["2", "3", "4", "5", "1"]],
      ["rotate right by one", ["1", "2", "3", "4", "5"], ["5", "1", "2", "3", "4"]],
      ["adjacent swap", ["1", "2", "3", "4", "5"], ["1", "3", "2", "4", "5"]],
      ["arbitrary shuffle", ["1", "2", "3", "4", "5"], ["3", "1", "5", "2", "4"]],
    ];

    it.each(scenarios)("%s round-trips exactly", (_name, original, edited) => {
      const { threeWayMerge } = loadHelpers();
      const merged = threeWayMerge(
        { steps: original },
        { steps: edited },
        { steps: original },
      );
      expect(merged.steps).toEqual(edited);
    });

    it("round-trips 200 random permutations of an 8-item list", () => {
      const { threeWayMerge } = loadHelpers();
      const original = ["a", "b", "c", "d", "e", "f", "g", "h"];
      const shuffle = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      };

      for (let attempt = 0; attempt < 200; attempt += 1) {
        const edited = shuffle(original);
        const merged = threeWayMerge(
          { steps: original },
          { steps: edited },
          { steps: original },
        );
        expect(merged.steps).toEqual(edited);
      }
    });
  });
});
