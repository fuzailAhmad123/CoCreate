import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import ToolBar from "./ToolBar";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowSideBar,
  setShowToolDesignBar,
} from "../../../slices/toolSlice";

const TopNavbar = ({ setShowShareModal, user, pathName }) => {
  const dispatch = useDispatch();
  const { showSideBar } = useSelector((state) => state.tool);
  return (
    <div className="w-[100%] h-[36px] absolute top-4 left-0 bg-transparent  flex items-center justify-center md:justify-between px-1 sm:px-7 ">
      {(user?.presenter === true || pathName === "/") && (
        <>
          <div className=" hidden md:block w-full h-[36px] z-[400] ">
            <div
              onClick={() => dispatch(setShowSideBar(!showSideBar))}
              className="h-[36px] w-[36px] hidden md:flex justify-center items-center rounded-[10px] bg-grey-25 dark:bg-black-50 cursor-pointer shadow-sm transition-300 hover:bg-blue-25 hover:bg-opacity-20 dark:text-grey-25 z-[400]"
            >
              <RxHamburgerMenu />
            </div>
          </div>

          <div className="w-full h-[36px] z-[400] ">
            <ToolBar/>
          </div>
        </>
      )}

      <div className="w-full h-[36px] hidden md:flex items-center justify-end gap-4 cursor-pointer ">
        <button
          onClick={() => setShowShareModal(true)}
          className="px-4 h-[36px] rounded-[10px] bg-blue-25  dark:bg-blue-175 dark:text-blue-100 dark:bg-opacity-100 dark:font-normal text-white font-extralight z-[400] hidden lg:block "
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
