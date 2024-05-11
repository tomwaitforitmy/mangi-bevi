import { RemoveDuplicates } from "../../common_functions/RemoveDuplicates.js";

describe("RemoveDuplicates", () => {
  it("all objects are the same", () => {
    const arrayWithDuplicates = [
      { id: 1, name: "tom" },
      { id: 1, name: "tom" },
      { id: 1, name: "tom" },
      { id: 1, name: "tom" },
    ];

    const expected = [{ id: 1, name: "tom" }];
    const result = RemoveDuplicates(arrayWithDuplicates);

    expect(result).toStrictEqual(expected);
  });
  it("removes only duplicates", () => {
    const arrayWithDuplicates = [
      { id: 1, name: "tom" },
      { id: 2, name: "tom" },
      { id: 3, name: "tom" },
      { id: 1, name: "tom" },
    ];

    const expected = [
      { id: 1, name: "tom" },
      { id: 2, name: "tom" },
      { id: 3, name: "tom" },
    ];
    const result = RemoveDuplicates(arrayWithDuplicates);

    expect(result).toStrictEqual(expected);
  });
  it("you can define another id", () => {
    const arrayWithDuplicates = [
      { number: 1, name: "tom" },
      { number: 2, name: "tom2" },
      { number: 3, name: "tom" },
      { number: 1, name: "tom" },
    ];

    const expected = [
      { number: 1, name: "tom" },
      { number: 2, name: "tom2" },
    ];
    const result = RemoveDuplicates(arrayWithDuplicates, "name");

    expect(result).toStrictEqual(expected);
  });
  it("does nothing for empty arrays", () => {
    const arrayWithDuplicates = [];

    const expected = [];
    const result = RemoveDuplicates(arrayWithDuplicates);

    expect(result).toStrictEqual(expected);
  });
});
