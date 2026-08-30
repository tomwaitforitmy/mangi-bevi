import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import User from "../../models/User";
import { ZATARMEALS } from "../../data/DummyMeals";

// This suite renders the actual route files under app/(app)/meals/meal/,
// not just the isolated EditIconOrNull component (see EditIconOrNull.spec.js
// for that). It exists because the permission check living correctly in
// EditIconOrNull doesn't prove a route wires it up correctly — the old
// pre-migration navigation file had exactly that gap: the meal-detail route
// gated its edit icon by permission, but the sibling images route didn't
// (see commit 4f0e47f). This suite catches that class of regression by
// exercising the real Stack.Screen options each route builds.
let mockSearchParams = {};
const mockCaptureOptions = jest.fn();

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockSearchParams,
  useRouter: () => ({ push: jest.fn() }),
  Stack: {
    Screen: (props) => {
      mockCaptureOptions(props.options);
      return null;
    },
  },
}));

// The screen bodies are heavy (pull in @rneui/themed via MealSpeedDial) and
// irrelevant here — only the route's own Stack.Screen header wiring matters.
jest.mock("../../screens/MealDetailScreen", () => () => null);
jest.mock("../../screens/ImagesScreen", () => () => null);

const MealDetailRoute =
  require("../../app/(app)/meals/meal/[mealId]").default;
const MealImagesRoute =
  require("../../app/(app)/meals/meal/[mealId]/images").default;

const author = ZATARMEALS[0].authorId;

function buildStore({ user, friendsOfAuthor = [] }) {
  return createStore(() => ({
    meals: { meals: ZATARMEALS },
    users: {
      users: [{ id: author, meals: [ZATARMEALS[0].id], friends: friendsOfAuthor }],
      user,
      userStats: null,
      userMealsData: null,
    },
  }));
}

// Renders the given route component for the given user and returns RTL's
// render API bound to whatever its Stack.Screen headerRight produces.
function renderHeaderRight(RouteComponent, user, { friendsOfAuthor } = {}) {
  mockCaptureOptions.mockClear();
  mockSearchParams = {
    mealId: ZATARMEALS[0].id,
    mealTitle: ZATARMEALS[0].title,
  };
  const store = buildStore({ user, friendsOfAuthor });

  render(
    <Provider store={store}>
      <RouteComponent />
    </Provider>,
  );

  const options = mockCaptureOptions.mock.calls.at(-1)[0];
  const headerRightElement = options.headerRight();

  return render(<Provider store={store}>{headerRightElement}</Provider>);
}

describe.each([
  ["meal-detail route (app/(app)/meals/meal/[mealId].js)", MealDetailRoute],
  ["images route (app/(app)/meals/meal/[mealId]/images.js)", MealImagesRoute],
])("%s, header top-right corner", (_label, RouteComponent) => {
  it("shows a locked, non-tappable icon (not the edit icon) for a user without edit rights", () => {
    const stranger = User("stranger-id", "Stranger", "s@mail.com", [], "token");

    const utils = renderHeaderRight(RouteComponent, stranger);

    expect(utils.UNSAFE_queryAllByProps({ name: "create-outline" })).toHaveLength(0);
    expect(utils.queryAllByTestId("edit-meal-icon")).toHaveLength(0);
    expect(utils.UNSAFE_queryAllByProps({ name: "lock-closed-outline" }).length).toBeGreaterThan(0);
    expect(utils.queryAllByTestId("edit-meal-icon-disabled")).toHaveLength(1);
  });

  it("renders the edit icon for the author", () => {
    const authorUser = User(author, "Author", "a@mail.com", [], "token");

    const utils = renderHeaderRight(RouteComponent, authorUser);

    expect(utils.queryAllByTestId("edit-meal-icon")).toHaveLength(1);
    expect(utils.queryAllByTestId("edit-meal-icon-disabled")).toHaveLength(0);
  });

  it("renders the edit icon for a friend of the author", () => {
    const friend = User("friend-id", "Friend", "f@mail.com", [], "token");

    const utils = renderHeaderRight(RouteComponent, friend, {
      friendsOfAuthor: ["friend-id"],
    });

    expect(utils.queryAllByTestId("edit-meal-icon")).toHaveLength(1);
    expect(utils.queryAllByTestId("edit-meal-icon-disabled")).toHaveLength(0);
  });
});
