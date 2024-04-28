import { HasEditPermission } from "../../common_functions/HasEditPermission.js";
import { ZATARMEALS } from "../../data/DummyMeals.js";
import User from "../../models/User.js";

describe("HasEditPermission", () => {
  it("author always has permission", () => {
    const user = User(
      "-N7fSxspZ7Yn91evKqd8", //author id of first meal in ZATARMEALS
      "any name",
      "any@mail.com",
      ["any meal id", "any other meal id"],
      "NotNeededHere",
    );

    expect(HasEditPermission(user, ZATARMEALS[0].authorId, undefined)).toEqual(
      true,
    );
  });

  it("friends of the author have permission", () => {
    const user = User(
      "I am a friend id", //author id of first meal in ZATARMEALS
      "any name",
      "any@mail.com",
      ["any meal id", "any other meal id"],
      "NotNeededHere",
    );

    const friends = ["I am a friend id", "another friend"];

    expect(HasEditPermission(user, ZATARMEALS[0].authorId, friends)).toEqual(
      true,
    );
  });
  it("doesn't crash if author doesn't have friends", () => {
    const user = User(
      "I am not a friend id", //author id of first meal in ZATARMEALS
      "any name",
      "any@mail.com",
      ["any meal id", "any other meal id"],
      "NotNeededHere",
    );

    expect(HasEditPermission(user, ZATARMEALS[0].authorId, undefined)).toEqual(
      false,
    );
    expect(HasEditPermission(user, ZATARMEALS[0].authorId, null)).toEqual(
      false,
    );
  });
  it("if there is only one friend, he still has permissions", () => {
    const user = User(
      "I the only friend id", //author id of first meal in ZATARMEALS
      "any name",
      "any@mail.com",
      ["any meal id", "any other meal id"],
      "NotNeededHere",
    );

    const friends = ["I the only friend id"];

    expect(HasEditPermission(user, ZATARMEALS[0].authorId, friends)).toEqual(
      true,
    );
  });
});
