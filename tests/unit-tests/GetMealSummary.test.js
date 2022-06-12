import { GetMealSummary } from "../../common_functions/GetMealSummary";
import Meal from "../../models/Meal";

const expectedOutput =
  "My nice title 😊\n" +
  "Ingredients:\n" +
  "- Sugar\n" +
  "- Salt\n" +
  "Steps:\n" +
  "- Mix it all together\n";

describe("Given a nicely initialized meal", () => {
  it("formats the output nicely", () => {
    const result = GetMealSummary(
      "My nice title 😊",
      ["Sugar", "Salt"],
      ["Mix it all together"]
    );
    expect(result).toEqual(expectedOutput);
  });
  it("handles a meal as well", () => {
    const niceInput = new Meal(
      "My nice title 😊",
      "xyz",
      "https:/some/url",
      ["Sugar", "Salt"],
      ["Mix it all together"],
      [],
      null,
      null
    );
    const result = GetMealSummary(
      niceInput.title,
      niceInput.ingredients,
      niceInput.steps
    );
    expect(result).toEqual(expectedOutput);
  });
});
