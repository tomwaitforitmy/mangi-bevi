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

function renderWithUser(user) {
  const state = {
    users: {
      users: [{ id: author, meals: [ZATARMEALS[0].id], friends: [] }],
      user,
      userStats: null,
      userMealsData: null,
    },
  };
  const store = createStore(() => state);

  return render(
    <Provider store={store}>
      <EditIconOrNull mealId={ZATARMEALS[0].id} currentTab="Info" />
    </Provider>,
  );
}

describe("EditIconOrNull (meal detail header edit icon)", () => {
  it("renders the edit icon when the current user is the author", () => {
    const user = User(author, "Author Name", "author@mail.com", [], "token");
    const { UNSAFE_root } = renderWithUser(user);
    expect(UNSAFE_root).toBeTruthy();
    // Ionicons "create-outline" is rendered by EditMangiIcon when permitted
    expect(
      screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders nothing when the current user has no edit permission", () => {
    const user = User("someone-else", "Other", "other@mail.com", [], "token");
    renderWithUser(user);
    expect(screen.UNSAFE_queryAllByProps({ name: "create-outline" }).length).toBe(0);
  });
});
