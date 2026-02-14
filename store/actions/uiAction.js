export const SET_CURRENT_TAB_VIEWED = "SET_CURRENT_TAB_VIEWED";

export const setCurrentTabViewed = (tab) => {
  return {
    type: SET_CURRENT_TAB_VIEWED,
    tab,
  };
};
