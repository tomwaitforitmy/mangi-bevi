import { ConvertArrayToArrayOfObjects } from "../../common_functions/ConvertArrayToArrayOfObjects";

describe("ConvertArrayToArrayOfObjects: Given an array of strings", () => {
  it("returns an array of objects with [{id: index, title: 'text'}]", () => {
    const stringArray = ["Cheese", "Tomatoes", "Water"];
    const expected = [
      { id: "0", title: "Cheese" },
      { id: "1", title: "Tomatoes" },
      { id: "2", title: "Water" },
    ];
    const result = ConvertArrayToArrayOfObjects(stringArray);
    expect(result).toEqual(expected);
  });
});
