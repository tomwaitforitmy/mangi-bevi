import React from "react";
import { render, screen } from "@testing-library/react-native";
import ReactionsBox from "../../components/ReactionsBox.js";
import Reaction from "../../models/Reaction.js";

describe("ReactionsBox", () => {
  it("renders a single reaction", () => {
    const reactions = [Reaction("tommy", "🥰")];

    render(<ReactionsBox reactions={reactions} />);
    expect(screen.queryByText("🥰")).toBeTruthy();
  });

  it("renders groups of emojis as numbers", () => {
    const reactions = [
      Reaction("tommy", "🥰"),
      Reaction("kathrin", "🥰"),
      Reaction("markus", "😋"),
    ];
    render(<ReactionsBox reactions={reactions} />);

    expect(screen.queryByText("🥰2")).toBeTruthy();
    expect(screen.queryByText("😋")).toBeTruthy();
  });
});
