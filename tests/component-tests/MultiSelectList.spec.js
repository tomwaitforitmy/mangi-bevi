import React from "react";
import { render, screen } from "@testing-library/react-native";
import User from "../../models/User";
import MultiSelectList from "../../components/MultiSelectList";
import TinyUserItem from "../../components/TinyUserItem";

describe("MultiSelectUsersList", () => {
  const u1 = User("u1", "My nice user 😊", "user1@users.com", [], "some id");

  const u2 = User("u2", "My nice user 😊 2", "user3@users.com", [], "some id");

  const u3 = User("u3", "My nice user 😊 3", "user3@users.com", [], "some id");

  const renderItem = (item) => {
    return <TinyUserItem user={item} />;
  };

  const users = [u1, u2, u3];

  it("renders user names", () => {
    render(
      <MultiSelectList
        data={users}
        visibleData={users}
        renderItem={renderItem}
      />,
    );
    screen.getByText("My nice user 😊");
    screen.getByText("My nice user 😊 2");
    screen.getByText("My nice user 😊 3");
  });

  it("renders less data via visibleData", () => {
    const visibleUsers = [u3];
    render(
      <MultiSelectList
        data={users}
        visibleData={visibleUsers}
        renderItem={renderItem}
      />,
    );
    expect(screen.queryByText("My nice user 😊")).toBeFalsy();
    expect(screen.queryByText("My nice user 😊 2")).toBeFalsy();
    screen.getByText("My nice user 😊 3");
  });
});
