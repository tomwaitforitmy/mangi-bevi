import { GetUserStats } from "../../common_functions/GetUserStats.js";
import Meal from "../../models/Meal.js";
import UserStats from "../../models/UserStats";

describe("GetUserStats", () => {
  it("calculates statistics over two meals", () => {
    const userMeals = [];
    const m1 = Meal(
      "Pizza",
      "m1",
      "NotNeededHere",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );
    const m2 = Meal(
      "Spaghetti",
      "m2",
      "NotNeededHere",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Cook the pasta", "Profit!"],
      "NotNeededHere",
      [],
      "NotNeedHere",
    );

    userMeals.push(m1);
    userMeals.push(m2);

    const userId = "u1";
    const expected = UserStats(userId, 2, 5, 6);

    const result = GetUserStats(userMeals, userId);
    expect(result).toEqual(expected);
  });

  it("calculates statistics over one meal", () => {
    const userMeals = [];
    const m1 = Meal(
      "Pizza",
      "m1",
      "NotNeededHere",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );

    userMeals.push(m1);

    const userId = "u1";
    const expected = UserStats(userId, 2, 3, 3);

    const result = GetUserStats(userMeals, userId);
    expect(result).toEqual(expected);
  });

  it("returns default values for no meals", () => {
    const userMeals = [];
    const userId = "u1";
    const expected = UserStats(userId, 0, 0, 0);

    const result = GetUserStats(userMeals, userId);
    expect(result).toEqual(expected);
  });

  it("calculates values for meals without data", () => {
    const userMeals = [];
    const m1 = Meal("Pizza");
    m1.ingredients = [];
    m1.steps = [];
    m1.tags = [];
    const m2 = Meal("Pasta");
    m2.ingredients = [];
    m2.steps = [];
    m2.tags = [];
    const m3 = Meal("Fries");
    m3.ingredients = [];
    m3.steps = [];
    m3.tags = [];
    userMeals.push(m1);
    userMeals.push(m2);
    userMeals.push(m3);

    const userId = "u1";
    const expected = UserStats(userId, 0, 0, 0);

    const result = GetUserStats(userMeals, userId);
    expect(result).toEqual(expected);
  });
});
