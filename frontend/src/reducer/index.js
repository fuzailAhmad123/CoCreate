import { combineReducers } from "@reduxjs/toolkit";
import toolReducer from "../slices/toolSlice"
import styleReducer from "../slices/styleSlice"

const rootReducer = combineReducers({
    tool:toolReducer,
    style:styleReducer
})

export default rootReducer