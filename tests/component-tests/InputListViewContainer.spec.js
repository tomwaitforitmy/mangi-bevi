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
    let expectedResult = false;
    render(
      <InputListViewContainer
        title="Insert your data here"
        data={sampleData}
        onLongPress={() => {
          expectedResult = true;
        }}
      />,
    );
    fireEvent(screen.getByText("tomato"), "onLongPress");
    expect(expectedResult).toBe(true);
  });
});

// title={"Steps"}
// data={formState.steps}
// onLongPress={() => setRenderStepsSort(true)}
// inputRef={inputStep}
// onPressIcon={(step) => {
//   formDispatch({
//     type: PREPARE_EDIT_STEP,
//     key: step,
//     ref: inputStep,
//   });
// }}
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
