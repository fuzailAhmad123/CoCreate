import {createSlice} from "@reduxjs/toolkit"


const initialState = {
      selectedTool: localStorage.getItem("selectedTool") ? localStorage.getItem("selectedTool") : null ,
      keepToolActive: localStorage.getItem("keepToolActive") ? Boolean(localStorage.getItem("keepToolActive")): false ,
      showBetaModule: localStorage.getItem("showBetaModule") ? Boolean(localStorage.getItem("showBetaModule")) : false , 
      showToolDesignBar: localStorage.getItem("showToolDesignBar") ? Boolean(localStorage.getItem("showToolDesignBar")) : false , 
}

const toolSlice = createSlice({
    name:"tool",
    initialState:initialState,
    reducers: {
        setSelectedTool(state , value){
               state.selectedTool = value.payload;
        },
       setKeepToolActive(state , value){
          state.keepToolActive = value.payload;
       },
       setShowBetaModule(state , value){
            state.showBetaModule = value.payload;
        },
        setShowToolDesignBar(state , value){
            state.showToolDesignBar = value.payload;
        }
    },
});


export const {setSelectedTool , setKeepToolActive , setShowBetaModule , setShowToolDesignBar} =toolSlice.actions;
export default toolSlice.reducer;