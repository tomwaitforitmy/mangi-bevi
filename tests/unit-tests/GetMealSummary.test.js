import {
  GetAuthorName,
  GetAuthorNameByMealId,
} from "../../common_functions/GetAuthorName";
import { GetMealSummary } from "../../common_functions/GetMealSummary";
import Meal from "../../models/Meal";

const expectedOutput =
  "My nice title 😊\n" +
  "Ingredients:\n" +
  "- Sugar\n" +
  "- Salt\n" +
  "Steps:\n" +
  "- Mix it all together\n" +
  "Created by Tommy\n";

const users = [
  {
    email: "tommy@mail.com",
    firebaseId: "-",
    id: "-N7fTSUz_WVEjEruisQV",
    meals: ["-N6nqAyvPZDY5N6fQHWo", "-NLH4uCVwlXnC--DJewk"],
    name: "Tommy",
  },
  {
    email: "tommy@test.com",
    firebaseId: "-",
    id: "-N7kdLYerkrUjJHvgQjX",
    meals: [],
    name: "tommy@test.com",
  },
];

describe("Given a nicely initialized meal", () => {
  it("formats the output nicely", () => {
    const result = GetMealSummary(
      "My nice title 😊",
      ["Sugar", "Salt"],
      ["Mix it all together"],
      "Tommy",
    );
    expect(result).toEqual(expectedOutput);
  });
  it("integrates with GetAuthorNameByMealId", () => {
    const niceInput = new Meal(
      "My nice title 😊",
      "-N6nqAyvPZDY5N6fQHWo",
      "https:/some/url",
      ["Sugar", "Salt"],
      ["Mix it all together"],
      [],
      null,
      null,
      "-N7fTSUz_WVEjEruisQV",
      null,
      null,
      null,
    );
    const authorName = GetAuthorNameByMealId(niceInput.id, users);

    const result = GetMealSummary(
      niceInput.title,
      niceInput.ingredients,
      niceInput.steps,
      authorName,
    );
    expect(result).toEqual(expectedOutput);
  });

  it("integrates with GetAuthorName", () => {
    const niceInput = new Meal(
      "My nice title 😊",
      "-N6nqAyvPZDY5N6fQHWo",
      "https:/some/url",
      ["Sugar", "Salt"],
      ["Mix it all together"],
      [],
      null,
      null,
      "-N7fTSUz_WVEjEruisQV",
      null,
      null,
      null,
    );
    const authorName = GetAuthorName(niceInput.authorId, users);

    const result = GetMealSummary(
      niceInput.title,
      niceInput.ingredients,
      niceInput.steps,
      authorName,
    );
    expect(result).toEqual(expectedOutput);
  });
});
