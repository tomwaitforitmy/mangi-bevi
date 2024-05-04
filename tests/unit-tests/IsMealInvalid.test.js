import {
  IsFormInvalid,
  IsMealInvalid,
} from "../../common_functions/IsMealInvalid.js";
import Meal from "../../models/Meal.js";

describe("IsMealInvalid", () => {
  it("Returns false if title exists, at least one ingredient and one step is given", () => {
    const m1 = Meal(
      "Valid title",
      "m1",
      "NotNeededHere",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );

    const result = IsMealInvalid(m1);

    expect(result).toEqual(false);
  });

  it("Returns true if no title given", () => {
    const m1 = Meal(
      null,
      "m1",
      "NotNeededHere",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );

    const result = IsMealInvalid(m1);

    expect(result).toEqual(true);
  });

  it("Returns true if no ingredients given", () => {
    const m1 = Meal(
      "Valid title",
      "m1",
      "NotNeededHere",
      [],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );

    const result = IsMealInvalid(m1);

    expect(result).toEqual(true);
  });

  it("Returns true if no steps given", () => {
    const m1 = Meal(
      "Valid title",
      "m1",
      "NotNeededHere",
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
      null,
      "NotNeededHere",
      ["t1", "t2"],
      "NotNeedHere",
    );

    const result = IsMealInvalid(m1);

    expect(result).toEqual(true);
  });
});

describe("IsFormInvalid - convenience method for IsMealValid", () => {
  it("Returns false if title exists, at least one ingredient and one step is given", () => {
    const result = IsFormInvalid(
      "Valid title",
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
    );

    expect(result).toEqual(false);
  });

  it("Returns true if no title given", () => {
    const result = IsFormInvalid(
      null,
      ["Cheese", "Tomatoes", "Oregano"],
      ["Heat up the oven", "Put stuff on the pizza", "Profit!"],
    );

    expect(result).toEqual(true);
  });

  it("Returns true if no ingredients given", () => {
    const result = IsFormInvalid("Valid title", null, [
      "Heat up the oven",
      "Put stuff on the pizza",
      "Profit!",
    ]);

    expect(result).toEqual(true);
  });

  it("Returns true if no steps given", () => {
    const result = IsFormInvalid(
      "Valid title",
      ["Cheese", "Tomatoes", "Oregano"],
      [],
    );

    expect(result).toEqual(true);
  });
});
