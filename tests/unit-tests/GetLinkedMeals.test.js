import { GetLinkedMeals } from "../../common_functions/GetLinkedMeals.js";
import Meal from "../../models/Meal.js";

describe("GetLinkedMeals", () => {
  const allMeals = [];
  const m1 = new Meal(
    "Pizza",
    "m1",
    "NotNeededHere",
    ["Cheese", "Tomatoes", "Oregano"],
    ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
    "NotNeededHere",
    ["t1", "t2"],
    "NotNeedHere",
  );
  const m2 = new Meal(
    "Spaghetti",
    "m2",
    "NotNeededHere",
    ["Cheese", "Tomatoes", "Oregano"],
    ["Cook the pasta", "Profit!"],
    "NotNeededHere",
    [],
    "NotNeedHere",
  );
  const m3 = new Meal(
    "Another Spaghetti",
    "m3",
    "NotNeededHere",
    ["Cheese", "Tomatoes", "Oregano"],
    ["Cook the pasta", "Profit!"],
    "NotNeededHere",
    [],
    "NotNeedHere",
  );

  allMeals.push(m1);
  allMeals.push(m2);
  allMeals.push(m3);

  it("creates an array of all linked meals", () => {
    m1.links = ["m2", "m3"];
    const expectedArray = [m2, m3];

    const result = GetLinkedMeals(allMeals, m1.links);
    expect(result).toEqual(expectedArray);
  });

  it("returns an empty array if links are empty", () => {
    const result = GetLinkedMeals(allMeals, []);
    expect(result).toEqual([]);
  });

  it("returns an empty array if links are null", () => {
    const result = GetLinkedMeals(allMeals, null);
    expect(result).toEqual([]);
  });
});
