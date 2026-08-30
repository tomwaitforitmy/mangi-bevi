import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import User from "../../models/User";
import { ZATARMEALS } from "../../data/DummyMeals";
import EditIconOrNull from "../../components/HeaderIcons/EditIconOrNull";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const author = ZATARMEALS[0].authorId;
const otherAuthor = ZATARMEALS[1].authorId;

function buildState({ friendsOfAuthor = [], user }) {
  return {
    users: {
      users: [
        { id: author, meals: [ZATARMEALS[0].id], friends: friendsOfAuthor },
        { id: otherAuthor, meals: [ZATARMEALS[1].id], friends: [] },
      ],
      user,
      userStats: null,
      userMealsData: null,
    },
  };
}

function renderWithUser(user, { mealId = ZATARMEALS[0].id, friendsOfAuthor } = {}) {
  const store = createStore(() => buildState({ friendsOfAuthor, user }));

  const utils = render(
    <Provider store={store}>
      <EditIconOrNull mealId={mealId} currentTab="Info" />
    </Provider>,
  );

  return { ...utils, store };
}

// Two related bugs this guards against:
// 1. A permission check that hides the icon's glyph (create-outline) but
//    still renders an empty, tappable Pressable — looks blank, bumps on
//    press, does nothing. Every "no permission" case must assert zero
//    edit-meal-icon Pressables, not just zero glyphs.
// 2. headerRight toggling between an element and `null` across meals,
//    which can leave a native header-transition snapshot ghost on iOS
//    (still visible, no longer tappable). The "no permission" case must
//    always render the same-sized edit-meal-icon-empty-slot placeholder
//    instead of nothing, so the header option's presence never toggles.
describe("EditIconOrNull (meal detail header edit icon)", () => {
  it("renders exactly one tappable edit icon when the current user is the author", () => {
    const user = User(author, "Author Name", "author@mail.com", [], "token");
    renderWithUser(user);

    expect(
      screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryAllByTestId("edit-meal-icon")).toHaveLength(1);
  });

  it("renders exactly one tappable edit icon when the current user is a friend of the author", () => {
    const user = User("friend-id", "Friend", "friend@mail.com", [], "token");
    renderWithUser(user, { friendsOfAuthor: ["friend-id"] });

    expect(
      screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryAllByTestId("edit-meal-icon")).toHaveLength(1);
  });

  it("renders an empty, non-interactive placeholder when the current user has no edit permission", () => {
    const user = User("stranger-id", "Stranger", "stranger@mail.com", [], "token");
    renderWithUser(user);

    expect(
      screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length,
    ).toBe(0);
    expect(screen.queryAllByTestId("edit-meal-icon")).toHaveLength(0);
    // Must still render a same-sized placeholder rather than null, so
    // headerRight's presence never toggles between meals (see file header).
    expect(screen.queryAllByTestId("edit-meal-icon-empty-slot")).toHaveLength(1);
  });

  it("removes the icon after navigating from a meal you can edit to one you can't, without unmounting", () => {
    // Simulates following a linked-meal link: the same header component
    // instance gets new props (mealId) rather than being remounted fresh.
    const user = User(author, "Author Name", "author@mail.com", [], "token");
    const store = createStore(() => buildState({ user }));

    const { rerender } = render(
      <Provider store={store}>
        <EditIconOrNull mealId={ZATARMEALS[0].id} currentTab="Info" />
      </Provider>,
    );
    expect(screen.queryAllByTestId("edit-meal-icon")).toHaveLength(1);

    rerender(
      <Provider store={store}>
        <EditIconOrNull mealId={ZATARMEALS[1].id} currentTab="Info" />
      </Provider>,
    );

    expect(
      screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length,
    ).toBe(0);
    expect(screen.queryAllByTestId("edit-meal-icon")).toHaveLength(0);
    expect(screen.queryAllByTestId("edit-meal-icon-empty-slot")).toHaveLength(1);
  });
});
