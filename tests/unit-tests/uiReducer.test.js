import uiReducer from "../../store/reducers/uiReducer";
import { setCurrentTabViewed } from "../../store/actions/uiAction";

describe("uiReducer", () => {
  it("defaults currentTabViewed to null (no pending tab to resume)", () => {
    const state = uiReducer(undefined, { type: "@@INIT" });
    expect(state.currentTabViewed).toBeNull();
  });

  it("sets currentTabViewed on SET_CURRENT_TAB_VIEWED", () => {
    const state = uiReducer(undefined, setCurrentTabViewed("Steps"));
    expect(state.currentTabViewed).toBe("Steps");
  });

  it("can be cleared back to null once consumed", () => {
    const withTab = uiReducer(undefined, setCurrentTabViewed("Steps"));
    const cleared = uiReducer(withTab, setCurrentTabViewed(null));
    expect(cleared.currentTabViewed).toBeNull();
  });
});
