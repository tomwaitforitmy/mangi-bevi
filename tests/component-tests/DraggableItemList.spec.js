import React from "react";
import { PaperProvider } from "react-native-paper";
import { render, act } from "@testing-library/react-native";
import DraggableItemList from "../../components/DraggableItemList";
import lightTheme from "../../theme/lightTheme";

// react-native-reorderable-list's real ReorderableList pulls in reanimated/
// worklets native machinery unavailable under Jest, and is irrelevant here
// -- only its onReorder/dragEnabled contract matters. reorderItems is
// reimplemented (verbatim from the library's own src/utils.ts) rather than
// requireActual'd, since that would also load the native parts.
let capturedOnReorder;
let mockDragEnabledHistory;

jest.mock("react-native-reorderable-list", () => ({
  __esModule: true,
  default: ({ onReorder, dragEnabled }) => {
    capturedOnReorder = onReorder;
    mockDragEnabledHistory.push(dragEnabled);
    return null;
  },
  reorderItems: (data, from, to) => {
    const newData = [...data];
    newData.splice(to, 0, newData.splice(from, 1)[0]);
    return newData;
  },
  useReorderableDrag: () => () => {},
}));

const renderList = (data, onSortEnd) =>
  render(
    <PaperProvider theme={lightTheme}>
      <DraggableItemList data={data} onSortEnd={onSortEnd} />
    </PaperProvider>,
  );

describe("DraggableItemList", () => {
  beforeEach(() => {
    mockDragEnabledHistory = [];
  });

  // Regression test: SortingListViewContainer/DraggableItemList silently
  // dropped moves when items were reordered in quick succession (e.g.
  // reversing a 5-item steps list), because handleReorder used to read the
  // list from a React state closure -- a second onReorder firing before
  // React committed the first setData saw the pre-move order and computed
  // its move on top of that, discarding the first move entirely.
  it("applies successive reorders fired before a re-render commits, without dropping the earlier move", () => {
    const onSortEnd = jest.fn();
    renderList(["1", "2", "3", "4", "5"], onSortEnd);

    act(() => {
      // move "1" (index 0) to the end: 2,3,4,5,1
      capturedOnReorder({ from: 0, to: 4 });
      // move "2" (now at index 0) to index 3: 3,4,5,2,1
      capturedOnReorder({ from: 0, to: 3 });
    });

    expect(onSortEnd).toHaveBeenLastCalledWith(["3", "4", "5", "2", "1"]);
  });

  // Regression test for the second, separate race: the library re-enables
  // dragging (and can report a new gesture's from/to) the instant onReorder
  // fires, independent of whether our data prop update has actually
  // committed into the rendered list. A drag started in that gap would
  // report indices for the order still on screen while we'd apply them to
  // the already-advanced internal order -- silently wrong. Dragging must
  // stay locked until the data update has committed.
  it("locks dragging out between a reorder firing and its data committing", () => {
    const onSortEnd = jest.fn();
    renderList(["1", "2", "3", "4", "5"], onSortEnd);

    act(() => {
      capturedOnReorder({ from: 0, to: 4 });
    });

    expect(mockDragEnabledHistory).toContain(false);
    expect(mockDragEnabledHistory[mockDragEnabledHistory.length - 1]).toBe(true);
  });
});
