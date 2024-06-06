import React, { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { BsDash } from "react-icons/bs";
import { RiArrowGoBackLine } from "react-icons/ri";
import { RiArrowGoForwardFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { setElements } from "../../../slices/toolSlice";
const BottomControls = ({ history , index, setIndex, state, setState, scale , setScale}) => {
  const { elements } = useSelector((state) => state.tool);
  const dispatch = useDispatch();


  // Undo operation
  const undo = () => {
    if (state.index > 2) {
      setState((prevState) => ({
        ...prevState,
        index: prevState.index - 2,
      }));
    }
  };

  // Redo operation
  const redo = () => {
    if (state.index < state.history.length - 1) {
      setState((prevState) => ({
        ...prevState,
        index: prevState.index + 2,
      }));
    }
  };

const onZoom = (delta) => {
  setScale((prev) => Math.min( Math.max(prev + delta, 0.1), 2 ));
}

  return (
    <>
      <div className="h-[36px] w-[60%] bg-grey-25 dark:bg-black-50 dark:text-grey-25 rounded-[10px] flex items-center justify-between px-2 text-black text-[15px] helvetica-light">
        <p onClick={() => onZoom(-0.1)} className="cursor-pointer ">
          <BsDash />
        </p>
        <p onClick={() => setScale(1)} className="text-[13px]">{new Intl.NumberFormat("en-GB", {style:"percent"}).format(scale)}</p>
        <p onClick={() => onZoom(0.1)} className="cursor-pointer ">
          <IoIosAdd />
        </p>
      </div>

      <div className={`h-[36px] w-[35%] dark:text-grey-25 rounded-[10px] flex items-center justify-between overflow-hidden  text-black text-[15px] helvetica-light  bg-grey-25 dark:bg-black-50 p-1  `}>
        <button
          // disabled={index === 0}
          onClick={undo}
          className={`text-[14px] helvetica-light cursor-pointer w-full h-full flex justify-center items-center rounded-[10px]  ${state.index > 2 ? "bg-grey-25 dark:bg-black-50" : " bg-grey-75 dark:bg-black-5 dark:bg-opacity-30"} `}
        >
          <RiArrowGoBackLine />
        </button>
        <button
        // disabled={index === history.length - 1}
        onClick={redo}
        className={`text-[14px] helvetica-light cursor-pointer w-full h-full flex justify-center items-center rounded-[10px] ${state.index < state.history.length - 1 ? "bg-grey-25 dark:bg-black-50" : " bg-grey-75 dark:bg-black-5 dark:bg-opacity-30"} `}
        >
          <RiArrowGoForwardFill />
        </button>
      </div>
    </>
  );
};

export default BottomControls;
