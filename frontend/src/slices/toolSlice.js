import {createSlice} from "@reduxjs/toolkit"


const initialState = {
      selectedTool: localStorage.getItem("selectedTool") ? localStorage.getItem("selectedTool") : "rectangle" ,
      keepToolActive: localStorage.getItem("keepToolActive") ? Boolean(localStorage.getItem("keepToolActive")): false ,
      showBetaModule: localStorage.getItem("showBetaModule") ? Boolean(localStorage.getItem("showBetaModule")) : false , 
      showToolDesignBar: localStorage.getItem("showToolDesignBar") ? Boolean(localStorage.getItem("showToolDesignBar")) : false , 
      showSideBar : localStorage.getItem("showSidebar") ? Boolean(localStorage.getItem("showSidebar")) : true , 
      elements : localStorage.getItem("elements") ? JSON.parse(localStorage.getItem("elements")) : [] , 
      action : localStorage.getItem("action") ? localStorage.getItem("action") : "none" ,
      selectedElement : null,
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
        },
        setShowSideBar(state , value){
            state.showSideBar = value.payload;
        },
        setElements(state , value){
            state.elements = value.payload;
        },
        setAction(state , value){
            state.action = value.payload;
        },
        setSelectedElement(state, value) {
            state.selectedElement = value.payload;
        }

    },
});


export const {setSelectedTool , setKeepToolActive , setShowBetaModule , setShowToolDesignBar, setShowSideBar , setElements , setAction , setSelectedElement} =toolSlice.actions;
export default toolSlice.reducer;