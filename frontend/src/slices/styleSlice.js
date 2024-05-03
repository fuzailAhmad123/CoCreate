import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  strokeColor: localStorage.getItem("strokeColor")
    ? localStorage.getItem("strokeColor")
    : null,
  backgroundColor: localStorage.getItem("backgroundColor")
    ? localStorage.getItem("backgroundColor")
    : null,
  backgroundHachureFill: localStorage.getItem("backgroundHachureFill")
    ? localStorage.getItem("backgroundHachureFill")
    : null,
  strokeWidth: localStorage.getItem("strokeWidth")
    ? localStorage.getItem("strokeWidth")
    : null,
  strokeStyle: localStorage.getItem("strokeStyle")
    ? localStorage.getItem("strokeStyle")
    : null,
  sloppiness: localStorage.getItem("sloppiness")
    ? localStorage.getItem("sloppiness")
    : null,
    edge: localStorage.getItem("edge")
    ? localStorage.getItem("edge")
    : null,
};

const styleSlice = createSlice({
  name: "style",
  initialState: initialState,
  reducers: {
    setStrokeColor(state, value) {
      state.strokeColor = value.payload;
    },
    setBackgroundColor(state, value) {
      state.backgroundColor = value.payload;
    },
    setBackgroundHachureFill(state, value) {
      state.backgroundHachureFill = value.payload;
    },
    setStrokeWidth(state, value) {
      state.strokeWidth = value.payload;
    },
    setStrokeStyle(state, value) {
      state.strokeStyle = value.payload;
    },
    setSloppiness(state, value) {
      state.sloppiness = value.payload;
    },
    setEdge(state, value) {
      state.edge = value.payload;
    },
  },
});

export const {
  setStrokeColor,
  setBackgroundColor,
  setBackgroundHachureFill,
  setStrokeWidth,
  setStrokeStyle,
  setSloppiness,
  setEdge
} = styleSlice.actions;
export default styleSlice.reducer;
