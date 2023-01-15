import {
  GetAuthorName,
  GetAuthorNameByMealId,
} from "../../common_functions/GetAuthorName.js";

const expectedOutput = "Tommy";
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

describe("Get the author name for a meal", () => {
  it("by user id", () => {
    const result = GetAuthorName("-N7fTSUz_WVEjEruisQV", users);
    expect(result).toEqual(expectedOutput);
  });

  it("by meal id", () => {
    const result = GetAuthorNameByMealId("-N6nqAyvPZDY5N6fQHWo", users);
    expect(result).toEqual(expectedOutput);
  });
});
