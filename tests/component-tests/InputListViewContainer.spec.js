import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import InputListViewContainer from "../../components/InputListViewContainer";

describe("InputListViewContainer", () => {
  const sampleData = ["lemon", "pie", "tomato", "sauce"];

  it("renders a title", () => {
    render(<InputListViewContainer title="Insert your data here" />);
    expect(screen.queryByText("Insert your data here")).toBeTruthy();
  });
  it("renders title and sample data", () => {
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
      />,
    );
    expect(screen.queryByText("Insert your data here")).toBeTruthy();
    expect(screen.queryByText("lemon")).toBeTruthy();
    expect(screen.queryByText("pie")).toBeTruthy();
    expect(screen.queryByText("tomato")).toBeTruthy();
    expect(screen.queryByText("sauce")).toBeTruthy();
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
});

// onChangeText={(value) => {
//   formDispatch({ type: SET_STEP_VALUE, value });
// }}
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
