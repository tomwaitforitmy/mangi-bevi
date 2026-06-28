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
      "Prepare the ingredients: Start with garlic and onions",
      "Prepare the ingredients: Take the garlic and onions",
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
});
