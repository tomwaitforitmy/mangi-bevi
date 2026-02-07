import { createSlice } from "@reduxjs/toolkit";
import { TITLES } from "../../constants/TabMenuTitles";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedTab: TITLES.INFO, // For MealDetailScreen and NewScreen
  },
  reducers: {
    setSelectedTab: (state, action) => {
      console.log("change to ", action.payload);
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = uiSlice.actions;
export default uiSlice.reducer;
