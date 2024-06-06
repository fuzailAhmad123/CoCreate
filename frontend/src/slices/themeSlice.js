import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : "light",
  canvasColor: localStorage.getItem("canvasColor")
    ? localStorage.getItem("canvasColor")
    : "#ffffff",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme(state, value) {
      state.theme = value.payload;
    },
    setCanvasColor(state, value) {
      state.canvasColor = value.payload;
    },
  },
});

export const { setTheme ,setCanvasColor } = themeSlice.actions;
export default themeSlice.reducer;
