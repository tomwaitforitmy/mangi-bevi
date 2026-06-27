describe("mealsAction merge helpers", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("../../common_functions/HandleResponseError", () => ({
      HandleResponseError: jest.fn(async () => true),
    }));
    jest.doMock("../../models/Meal", () => () => ({}));
    jest.doMock("../../store/actions/usersAction", () => ({ UPDATE_USER_STATS: "UPDATE_USER_STATS" }));
    jest.doMock("../../store/actions/authAction", () => ({ getToken: jest.fn(async () => "token") }));
    jest.doMock("../../data/Environment", () => ({ DEV_MODE: false }));
    jest.doMock("../../common_functions/UnlinkMeals", () => ({ UnlinkMeals: jest.fn() }));
    jest.doMock("../../firebase/urls", () => ({
      getMealsUrl: jest.fn(() => "https://example.com/meals.json?auth=token"),
      getMealUrl: jest.fn((id) => `https://example.com/meals/${id}.json?auth=token`),
      getPublicMealsUrl: jest.fn(() => "https://example.com/meals.json"),
    }));
    jest.doMock("../../firebase/optimisticTransaction", () => ({
      runFirebaseTransaction: jest.fn(async (_url, mergeFn) => mergeFn({})),
    }));
    jest.doMock("../../image_processing/deleteImages", () => jest.fn(async () => true));
  });

  const loadHelpers = () => require("../../store/actions/mealsAction");

  it("mergeArrays combines unique values and handles undefined", () => {
    const { mergeArrays } = loadHelpers();
    expect(mergeArrays(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
    expect(mergeArrays(undefined, ["c"])).toEqual(["c"]);
    expect(mergeArrays(["a"], undefined)).toEqual(["a"]);
    expect(mergeArrays(undefined, undefined)).toEqual([]);
  });

  it("buildMealUpdatePayload preserves current links when meal.links are stale", () => {
    const { buildMealUpdatePayload } = loadHelpers();
    const current = {
      title: "Current title",
      links: ["link-from-B"],
      reactions: [{ authorId: "user2", emoji: "👍" }],
      id: "meal1",
      isSelected: true,
    };
    const staleMeal = {
      title: "Updated title",
      links: ["link-from-A"],
      reactions: [],
      id: "meal1",
      isSelected: false,
    };

    const payload = buildMealUpdatePayload(current, staleMeal);

    expect(payload.title).toBe("Updated title");
    expect(payload.links).toEqual(["link-from-B", "link-from-A"]);
    expect(payload.reactions).toEqual(current.reactions);
    expect(payload.id).toBeUndefined();
    expect(payload.isSelected).toBeUndefined();
  });

  it("buildMealUpdatePayload uses meal.links when current.links is undefined", () => {
    const { buildMealUpdatePayload } = loadHelpers();
    const current = {
      title: "Current title",
      reactions: [],
    };
    const meal = {
      title: "Updated title",
      links: ["link-from-A"],
      reactions: [],
    };

    const payload = buildMealUpdatePayload(current, meal);
    expect(payload.links).toEqual(["link-from-A"]);
  });
});
