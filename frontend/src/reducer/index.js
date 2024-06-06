import { combineReducers } from "@reduxjs/toolkit";
import toolReducer from "../slices/toolSlice"
import styleReducer from "../slices/styleSlice"
import themeReducer from "../slices/themeSlice"

const rootReducer = combineReducers({
    tool:toolReducer,
    style:styleReducer,
    theme:themeReducer
})

export default rootReducer