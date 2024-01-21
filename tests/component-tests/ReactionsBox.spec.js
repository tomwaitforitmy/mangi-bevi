import React from "react";
import { render, screen } from "@testing-library/react-native";
import ReactionsBox from "../../components/ReactionsBox.js";
import Colors from "../../constants/Colors.js";
import Reaction from "../../models/Reaction.js";

describe("ReactionsBox", () => {
  it("renders a single reaction", () => {
    const reactions = [new Reaction("tommy", "🥰")];

    render(<ReactionsBox reactions={reactions} />);
    screen.debug();
    expect(screen.queryByText("🥰")).toBeTruthy();
  });

  it("renders groups of emojis as numbers", () => {
    const reactions = [
      new Reaction("tommy", "🥰"),
      new Reaction("kathrin", "🥰"),
      new Reaction("markus", "😋"),
    ];
    render(<ReactionsBox reactions={reactions} />);
    screen.debug();

    expect(screen.queryByText("🥰2")).toBeTruthy();
    expect(screen.queryByText("😋")).toBeTruthy();
  });
});
