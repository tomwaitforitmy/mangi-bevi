import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, act } from "@testing-library/react-native";
import DraggableItemList from "../../components/DraggableItemList";
import lightTheme from "../../theme/lightTheme";

// react-native-reorderable-list's real ReorderableList pulls in reanimated/
// worklets native machinery unavailable under Jest, and is irrelevant here
// -- only its onReorder contract matters. reorderItems is reimplemented
// (verbatim from the library's own src/utils.ts) rather than requireActual'd,
// since that would also load the native parts.
let capturedOnReorder;

jest.mock("react-native-reorderable-list", () => ({
  __esModule: true,
  default: ({ onReorder }) => {
    capturedOnReorder = onReorder;
    return null;
  },
  reorderItems: (data, from, to) => {
    const newData = [...data];
    newData.splice(to, 0, newData.splice(from, 1)[0]);
    return newData;
  },
  useReorderableDrag: () => () => {},
}));

describe("DraggableItemList", () => {
  // Regression test: SortingListViewContainer/DraggableItemList silently
  // dropped moves when items were reordered in quick succession (e.g.
  // reversing a 5-item steps list), because handleReorder used to read the
  // list from a React state closure -- a second onReorder firing before
  // React committed the first setData saw the pre-move order and computed
  // its move on top of that, discarding the first move entirely.
  it("applies successive reorders fired before a re-render commits, without dropping the earlier move", () => {
    const onSortEnd = jest.fn();
    render(
      <PaperProvider theme={lightTheme}>
        <DraggableItemList
          data={["1", "2", "3", "4", "5"]}
          onSortEnd={onSortEnd}
        />
      </PaperProvider>,
    );

    act(() => {
      // move "1" (index 0) to the end: 2,3,4,5,1
      capturedOnReorder({ from: 0, to: 4 });
      // move "2" (now at index 0) to index 3: 3,4,5,2,1
      capturedOnReorder({ from: 0, to: 3 });
    });

    expect(onSortEnd).toHaveBeenLastCalledWith(["3", "4", "5", "2", "1"]);
  });
});
