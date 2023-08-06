import React from "react";
import { render, screen } from "@testing-library/react-native";
import User from "../../models/User";
import MultiSelectUsersList from "../../components/MultiSelectUsersList";

describe("MultiSelectUsersList", () => {
  const u1 = new User(
    "u1",
    "My nice user 😊",
    "user1@users.com",
    [],
    "some id",
  );

  const u2 = new User(
    "u2",
    "My nice user 😊 2",
    "user3@users.com",
    [],
    "some id",
  );

  const u3 = new User(
    "u3",
    "My nice user 😊 3",
    "user3@users.com",
    [],
    "some id",
  );

  const users = [u1, u2, u3];

  it("renders user names", () => {
    render(<MultiSelectUsersList users={users} />);
    screen.getByText("My nice user 😊");
    screen.getByText("My nice user 😊 2");
    screen.getByText("My nice user 😊 3");
  });
});
