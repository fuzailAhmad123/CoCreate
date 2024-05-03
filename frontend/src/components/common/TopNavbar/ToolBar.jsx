import React, { useState } from "react";
import { MdLockOpen } from "react-icons/md";
import { IoHandLeftOutline } from "react-icons/io5";
import { IoHandLeftSharp } from "react-icons/io5";
import { PiCursorLight } from "react-icons/pi";
import { PiCursorFill } from "react-icons/pi";
import { IoSquareOutline } from "react-icons/io5";
import { IoSquare } from "react-icons/io5";
import { FaRegCircle } from "react-icons/fa6";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { MdArrowRightAlt } from "react-icons/md";
import { GoDash } from "react-icons/go";
import { HiOutlinePencil } from "react-icons/hi2";
import { CiImageOn } from "react-icons/ci";
import { CiEraser } from "react-icons/ci";
import { TbTriangleSquareCircle } from "react-icons/tb";
import ToolsList from "../../../data/toolbar-list.json";
import { GoCircle } from "react-icons/go";
import { GoPencil } from "react-icons/go";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { PiHandLight } from "react-icons/pi";
import { SlLockOpen } from "react-icons/sl";
import { PiHandFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { setKeepToolActive, setSelectedTool, setShowBetaModule, setShowToolDesignBar } from "../../../slices/toolSlice";

const ToolBar = () => {
    const {selectedTool , keepToolActive , showBetaModule} = useSelector((state) => state.tool);
    const dispatch = useDispatch();

  return (
    <div className="min-w-[550px] w-fit min-h-[36px] h-fit p-1 flex items-center gap-x-2 bg-white  border border-grey-25 rounded-[10px] toolbar-shadow">
      <div
      onClick={() => dispatch(setKeepToolActive(!keepToolActive) ) }
       className={`w-[36px] h-[36px] flex justify-center items-center rounded-[10px] cursor-pointer transition-300 text-[15px]
      ${keepToolActive === true ? "bg-blue-25 bg-opacity-20 text-blue-100 hover:bg-blue-25 hover:bg-opacity-20" :" bg-white hover:bg-grey-5 text-black"} `}>
        <SlLockOpen/>
      </div>

      <div className="w-fit h-[36px] px-2 border-l border-r border-grey-25 flex items-center gap-x-1">
        {ToolsList.map((tool, index) => (
          <div
            key={index}
            onClick={() => {dispatch(setSelectedTool(tool?.tool))
                     dispatch(setShowToolDesignBar(true))
            }}
           className={`w-[36px] h-[36px] text-[16px] flex justify-center items-center  rounded-[10px] cursor-pointer  text-black transition-300
           ${selectedTool === tool?.tool ? "bg-blue-25 bg-opacity-20 text-blue-100 hover:bg-blue-25 hover:bg-opacity-20" :" bg-white hover:bg-grey-5 text-black"} `}>
            {
                tool?.tool === "hand" ? (
                    <>
                    {
                           selectedTool === tool?.tool ? (<PiHandLight/>)  : <PiHandLight/>
                    }
                    </>
                ) : 
                tool?.tool === "cursor" ? (
                    <>
                    {
                           selectedTool === tool?.tool ? (<PiCursorFill/>)  : <PiCursorLight/>
                    }
                    </>
                ) : 
                tool?.tool === "square" ? (
                    <>
                    {
                           selectedTool === tool?.tool ? (<IoSquare/>)  : <IoSquareOutline/>
                    }
                    </>
                ) : 
                tool?.tool === "rhombus" ? (
                    <>
                    {
                           selectedTool === tool?.tool ? (<IoSquare className="rotate-45 text-[13px]"/>)  : <IoSquareOutline className="rotate-45 text-[13px] "/>
                    }
                    </>
                ) : 
                tool?.tool === "circle" ? (
                    <>
                    {
                           selectedTool === tool?.tool ? (<RiCheckboxBlankCircleFill/>)  : <GoCircle/>
                    }
                    </>
                ) : 
                tool?.tool === "arrow" ? (<HiOutlineArrowLongRight/>) : 
                tool?.tool === "line" ? (<GoDash/>) : 
                tool?.tool === "pencil" ? (<GoPencil/>) : 
                tool?.tool === "text" ? (<p>A</p>) : 
                tool?.tool === "image" ? (<CiImageOn/>) : 
                tool?.tool === "eraser" ? (<CiEraser/>) : (<></>)
            }
          </div>
        ))}
      </div>

      <div 
      onClick={() => dispatch(setShowBetaModule(!showBetaModule) ) }
      className={`w-[36px] h-[36px] flex justify-center items-center rounded-[10px] cursor-pointer transition-300 text-black text-opacity-70 text-[15px]
       ${showBetaModule === true ? "bg-blue-25 bg-opacity-20 text-blue-100 hover:bg-blue-25 hover:bg-opacity-20" :" bg-white hover:bg-grey-5 text-black"} 
       `}>
        <TbTriangleSquareCircle/>
      </div>
    </div>
  );
};

export default ToolBar;
