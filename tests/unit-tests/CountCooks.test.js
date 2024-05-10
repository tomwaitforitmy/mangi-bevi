import { CountCooks } from "../../common_functions/CountCooks.js";
import MealCookedByUser from "../../models/MealCookedByUser";

describe("CountCooks", () => {
  it("returns an array of objects with [{user: 'id', amount: 'int'}]", () => {
    const cookedByUser = [
      MealCookedByUser("1", "m1", "u1"),
      MealCookedByUser("2", "m1", "u2"),
      MealCookedByUser("3", "m1", "u1"),
      MealCookedByUser("4", "m1", "u1"),
      MealCookedByUser("5", "m1", "u1"),
      MealCookedByUser("6", "m1", "u1"),
      MealCookedByUser("7", "m1", "u3"),
    ];
    const expected = [
      { userId: "u1", amount: 5 },
      { userId: "u2", amount: 1 },
      { userId: "u3", amount: 1 },
    ];
    const result = CountCooks(cookedByUser);
    expect(result).toEqual(expected);
  });
  it("works for a single event", () => {
    const cookedByUser = [MealCookedByUser("1", "m1", "u1")];
    const expected = [{ userId: "u1", amount: 1 }];
    const result = CountCooks(cookedByUser);
    expect(result).toEqual(expected);
  });
});
