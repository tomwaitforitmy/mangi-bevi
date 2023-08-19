import { GetFriends } from "../../common_functions/GetFriends.js";

describe("GetFriends", () => {
  it("returns a list of users", () => {
    const users = [
      {
        email: "tommy@mail.com",
        firebaseId: "-",
        id: "-N7fTSUz_WVEjEruisQV",
        friends: ["-N6nqAyvPZDY5N6fQHWo", "-NLH4uCVwlXnC--DJewk"],
        name: "Tommy",
      },
      {
        email: "tommy@test.com",
        firebaseId: "-",
        id: "-N7kdLYerkrUjJHvgQjX",
        friends: [],
        name: "tommy@test.com",
      },
    ];

    const empty = GetFriends("-N7kdLYerkrUjJHvgQjX", users);
    expect(empty).toEqual([]);

    const result = GetFriends("-N7fTSUz_WVEjEruisQV", users);
    expect(result).toEqual(["-N6nqAyvPZDY5N6fQHWo", "-NLH4uCVwlXnC--DJewk"]);
  });
});
