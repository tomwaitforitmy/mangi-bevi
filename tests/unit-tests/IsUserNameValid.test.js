import { IsUserNameValid } from "../../common_functions/IsUserNameValid.js";

describe("IsUserNameValid", () => {
  it("@ is not allowed", () => {
    const userName = "Something with @ in string";
    const existingUsers = [];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(false);
  });

  it("anything else is ok", () => {
    const userName = "anything else is ok";
    const existingUsers = [];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(true);
  });

  it("max 20 characters", () => {
    const userName = "123456789012345678901";
    const existingUsers = [];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(false);
  });

  it("smilies are ok", () => {
    const userName = "😍😍😍";
    const existingUsers = [];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(true);
  });

  it("usernames have to be unique", () => {
    const userName = "tommy";
    const existingUsers = [
      "tommy",
      "jules",
      "john",
      "doe",
      "franky",
      "jessie",
      "kimber",
      "charlie",
    ];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(false);
  });

  it("usernames have to be unique #2", () => {
    const userName = "tommy";
    const existingUsers = [
      "charlie",
      "jules",
      "john",
      "doe",
      "franky",
      "jessie",
      "tommy",
      "charlie",
    ];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(false);
  });

  it("usernames have to be unique #3", () => {
    const userName = "tommy 🤩";
    const existingUsers = [
      "charlie",
      "jules",
      "john",
      "doe",
      "franky",
      "jessie",
      "tommy 🤩",
      "charlie",
    ];
    const actual = IsUserNameValid(existingUsers, userName);

    expect(actual).toBe(false);
  });
});
