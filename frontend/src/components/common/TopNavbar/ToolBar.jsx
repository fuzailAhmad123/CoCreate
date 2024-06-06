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
import {
  setKeepToolActive,
  setSelectedTool,
  setShowBetaModule,
  setShowSideBar,
  setShowToolDesignBar,
} from "../../../slices/toolSlice";
import { RxHamburgerMenu } from "react-icons/rx";

const ToolBar = () => {
  const { selectedTool, keepToolActive, showBetaModule, showSideBar } =
    useSelector((state) => state.tool);
  const dispatch = useDispatch();

  const setToolType = (tool) => {
    localStorage.setItem("selectedTool", tool);
    dispatch(setSelectedTool(tool));
    if (tool !== "hand" && tool !== "cursor" && tool !== "eraser") {
      dispatch(setShowToolDesignBar(true));
      localStorage.setItem("showToolDesignBar", true);
    } else {
      dispatch(setShowToolDesignBar(false));
      localStorage.setItem("showToolDesignBar", false);
    }
  };
  return (
    <div className="min-w-[95%] max-w-[95%] sm:max-w-max sm:min-w-[550px] w-fit min-h-[36px] h-fit p-1 flex items-center gap-x-2 bg-white dark:bg-black-50  border border-grey-25 dark:border-none rounded-[10px] toolbar-shadow z-[400] overflow-x-scroll no-scrollbar  sm:overflow-hidden">
      <div
        onClick={() => dispatch(setShowSideBar(!showSideBar))}
        className={`min-w-[36px] h-[36px] flex md:hidden justify-center items-center rounded-[10px] cursor-pointer transition-300 text-black text-opacity-70 text-[15px] text-black-5 dark:text-grey-75 hover:bg-grey-75 hover:bg-opacity-20`}
      >
        <RxHamburgerMenu />
      </div>

      <div
        onClick={() => {
          dispatch(setKeepToolActive(!keepToolActive));
          localStorage.setItem("keepToolActive", !keepToolActive);
        }}
        className={`min-w-[36px] h-[36px] flex justify-center items-center rounded-[10px] cursor-pointer transition-300 text-[15px]
      ${
        keepToolActive === true
          ? "bg-blue-25  dark:bg-blue-150 dark:bg-opacity-40 dark:text-grey-25 bg-opacity-20 text-blue-100 hover:bg-blue-25 hover:bg-opacity-20"
          : " bg-white hover:bg-grey-5   dark:bg-black-50 dark:text-grey-25 text-black"
      } `}
      >
        <SlLockOpen />
      </div>

      <div className="w-fit h-[36px] px-2 border-l border-r border-grey-25 dark:border-grey-75 dark:border-opacity-20 flex items-center gap-x-1">
        {ToolsList.map((tool, index) => (
          <div
            key={index}
            onClick={() => setToolType(tool?.tool)}
            className={`w-[36px] h-[36px] text-[16px] flex justify-center items-center  rounded-[10px] cursor-pointer  text-black transition-300
           ${
             selectedTool === tool?.tool
               ? "bg-blue-25 bg-opacity-20  dark:bg-blue-150 dark:bg-opacity-40 dark:text-grey-25  text-blue-100 hover:bg-blue-25 hover:bg-opacity-20"
               : " bg-white hover:bg-grey-5 dark:bg-black-50 dark:text-grey-25 text-black"
           } `}
          >
            {tool?.tool === "hand" ? (
              <>
                {selectedTool === tool?.tool ? (
                  <PiHandLight />
                ) : (
                  <PiHandLight />
                )}
              </>
            ) : tool?.tool === "cursor" ? (
              <>
                {selectedTool === tool?.tool ? (
                  <PiCursorFill />
                ) : (
                  <PiCursorLight />
                )}
              </>
            ) : tool?.tool === "rectangle" ? (
              <>
                {selectedTool === tool?.tool ? (
                  <IoSquare />
                ) : (
                  <IoSquareOutline />
                )}
              </>
            ) : tool?.tool === "rhombus" ? (
              <>
                {selectedTool === tool?.tool ? (
                  <IoSquare className="rotate-45 text-[13px]" />
                ) : (
                  <IoSquareOutline className="rotate-45 text-[13px] " />
                )}
              </>
            ) : tool?.tool === "circle" ? (
              <>
                {selectedTool === tool?.tool ? (
                  <RiCheckboxBlankCircleFill />
                ) : (
                  <GoCircle />
                )}
              </>
            ) : tool?.tool === "arrow" ? (
              <HiOutlineArrowLongRight />
            ) : tool?.tool === "line" ? (
              <GoDash />
            ) : tool?.tool === "pencil" ? (
              <GoPencil />
            ) : tool?.tool === "text" ? (
              <p>A</p>
            ) : tool?.tool === "image" ? (
              <CiImageOn />
            ) : tool?.tool === "eraser" ? (
              <CiEraser />
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>

      <div
        onClick={() => dispatch(setShowBetaModule(!showBetaModule))}
        className={`min-w-[36px] h-[36px] flex justify-center items-center rounded-[10px] cursor-pointer transition-300 text-black text-opacity-70 text-[15px]
       ${
         showBetaModule === true
           ? "bg-blue-25 bg-opacity-20  dark:bg-blue-150 dark:bg-opacity-40 dark:text-grey-25   text-blue-100 hover:bg-blue-25 hover:bg-opacity-20"
           : " bg-white hover:bg-grey-5 dark:bg-black-50 dark:text-grey-25 text-black"
       } 
       `}
      >
        <TbTriangleSquareCircle />
      </div>
    </div>
  );
};

export default ToolBar;
