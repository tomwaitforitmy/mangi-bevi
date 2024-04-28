import { GetUserMeals } from "../../common_functions/GetUserMeals.js";
import { MEALS } from "../../data/DummyMeals.js";
import Meal from "../../models/Meal";
import User from "../../models/User.js";

describe("GetUserMeals", () => {
  it("selects all meals with a given user id", () => {
    const meals = [];
    const user = new User(
      "u1",
      "Tommy",
      "Tom@Test.com",
      ["m1", "m2"],
      "NotNeededHere",
    );
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

    meals.push(m1);
    meals.push(m2);

    const result = GetUserMeals(meals, user.meals);
    expect(result).toEqual(meals);
  });

  it("selects no meals if no id give", () => {
    const user = new User("u1", "Tommy", "Tom@Test.com", [], "NotNeededHere");
    const result = GetUserMeals(MEALS, user.meals);
    expect(result).toEqual([]);
  });
  it("selects from a larger array", () => {
    const result = GetUserMeals(MEALS, ["m1", "m2"]);
    expect(result.length).toEqual(2);
  });
  it("selects a single meal from larger array", () => {
    const result = GetUserMeals(MEALS, ["m5"]);
    expect(result.length).toEqual(1);
    expect(result[0].title).toEqual("Salad with Smoked Salmon");
  });
});
