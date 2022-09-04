import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import InputListViewContainer from "../../components/InputListViewContainer";

describe("InputListViewContainer", () => {
  const sampleData = ["lemon", "pie", "tomato", "sauce"];

  it("renders a title", () => {
    render(<InputListViewContainer title="Insert your data here" />);
    screen.getByText("Insert your data here");
  });
  it("renders title and sample data", () => {
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
      />,
    );
    screen.getByText("Insert your data here");
    screen.getByText("lemon");
    screen.getByText("pie");
    screen.getByText("tomato");
    screen.getByText("sauce");
  });

  it("activates onLongPress", () => {
    let actualResult = false;
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
        onLongPress={() => {
          actualResult = true;
        }}
      />,
    );
    fireEvent(screen.getByText("tomato"), "onLongPress");
    expect(actualResult).toBe(true);
  });

  it("activates onPress icon with correct text", () => {
    let actualResult = -1;
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
        onPressIcon={(text) => {
          actualResult = text;
        }}
      />,
    );
    fireEvent.press(screen.getByTestId("tomato-icon"));
    expect(actualResult).toBe("tomato");
  });

  it("activates onChangeText with correct text", () => {
    let actualResult = -1;
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
        onChangeText={(text) => {
          actualResult = text;
        }}
      />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Enter text"), "garlic");
    expect(actualResult).toBe("garlic");
  });
});

// onBlur={() => {
//   if (formState.stepIndex !== null) {
//     formDispatch({
//       type: EDIT_STEP,
//       value: formState.stepValue,
//       ref: inputStep,
//     });
//   } else {
//     formDispatch({
//       type: ADD_STEP,
//       value: formState.stepValue,
//       ref: inputStep,
//     });
//   }
// }}
