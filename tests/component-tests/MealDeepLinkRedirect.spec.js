import React from "react";
import { render } from "@testing-library/react-native";
import MealDeepLinkRedirect from "../../app/meal/[mealId]";

const mockReplace = jest.fn();
let mockIsAuthenticated = false;

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ mealId: "m1", mealTitle: "Spaghetti" }),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock("../../common_functions/useAuthState", () => ({
  useAuthState: () => mockIsAuthenticated,
}));

describe("MealDeepLinkRedirect (app/meal/[mealId].js)", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("redirects to the authenticated meal-detail route when signed in", () => {
    mockIsAuthenticated = true;
    render(<MealDeepLinkRedirect />);

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/meals/meal/[mealId]",
      params: { mealId: "m1", mealTitle: "Spaghetti" },
    });
  });

  it("redirects to the not-authenticated detail route when signed out", () => {
    mockIsAuthenticated = false;
    render(<MealDeepLinkRedirect />);

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/detail/[mealId]",
      params: { mealId: "m1", mealTitle: "Spaghetti" },
    });
  });
});
