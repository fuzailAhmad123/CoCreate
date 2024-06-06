import React, { useEffect } from "react";
import { RxImage } from "react-icons/rx";
import { IoPeopleOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscGithubAlt } from "react-icons/vsc";
import { RiTwitterXLine } from "react-icons/ri";
import { RiLinkedinLine } from "react-icons/ri";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineNightlight } from "react-icons/md";
import { GoDeviceDesktop } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import CanvasColorsList from "../../../data/canvasbackgorund-list.json";
import DarkCanvasColorsList from "../../../data/dark-canvasColor-list.json";
import { setCanvasColor, setTheme } from "../../../slices/themeSlice";
import { setElements } from "../../../slices/toolSlice";
import { LuScreenShare } from "react-icons/lu";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import { PiChatsCircle } from "react-icons/pi";
const Sidebar = ({
  canvasRef,
  ctxRef,
  setConfirmationModal,
  setState,
  setShowShareModal,
  setUser,
  socket,
  setUsersUpdated, 
  setShowPopUp,
  usersUpdated, 
  users,
  chats,
  setShowChats
}) => {
  const { theme, canvasColor } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState(null);
  const roomId = useParams();
  const location = useLocation().pathname;
  useEffect(() => {
    setRoomID(roomId);
  }, [roomId, location]);

  useEffect(() => {
    //system
    if(localStorage.getItem("theme") === null && theme === "system"){
      //have to select from system theme
      if(window.matchMedia("(prefers-color-scheme: dark)").matches){
        // set dark 
        document.documentElement.classList.add("dark");
        dispatch(setCanvasColor("#121212"));
      }else{
        document.documentElement.classList.remove("dark");
        dispatch(setCanvasColor("#ffffff"));
      }
    }
    else if (localStorage.getItem("theme") === "dark" && theme === "dark"){
      document.documentElement.classList.add("dark");
      dispatch(setCanvasColor("#121212"));
    }
    else if(localStorage.getItem("theme") === "light" && theme === "light"){
      document.documentElement.classList.remove("dark");
      dispatch(setCanvasColor("#ffffff"));
    }
  }, [localStorage.theme, theme]);

  const handleLightMode = () => {
    localStorage.setItem("theme", "light");
    dispatch(setTheme("light"));
    dispatch(setCanvasColor("#ffffff"));
  };

  const handleDarkMode = () => {
    localStorage.setItem("theme", "dark");
    dispatch(setTheme("dark"));
    dispatch(setCanvasColor("#121212"));
  };

  const handleSystemPreference = () => {
    localStorage.removeItem("theme");
    dispatch(setTheme("system"));
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      dispatch(setCanvasColor("#121212"));
    } else {
      dispatch(setCanvasColor("#ffffff"));
    }
  };

  const clearCanvas = () => {
    localStorage.setItem("elements", []);
    dispatch(setElements([]));

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setState({
      history: [[]],
      index: 0,
    });

    setConfirmationModal(null);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", null);
    setUser(null);
    sessionStorage.setItem("user", null);
    setRoomID(null);
    navigate("/");
    setConfirmationModal(null);
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-y-1">
      <div className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 helvetica-light cursor-pointer hover:bg-grey-5 text-opacity-60 dark:bg-opacity-20">
        <RxImage className="text-[14px]" />
        <p>Export Image...</p>
      </div>

      <div onClick={() => setShowShareModal(true)} className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 helvetica-light cursor-pointer hover:bg-grey-5 text-opacity-60 dark:bg-opacity-20">
        <IoPeopleOutline className="text-[14px]" />
        <p>Live Sharing...</p>
      </div>

      <div
        onClick={() =>
          setConfirmationModal({
            title: "Reset the Canvas ?",
            description: "Are you sure you want to clear the canvas?",
            btn1Text: "Cancel",
            btn2Text: "Reset Canvas",
            btn1Handler: () => {
              setConfirmationModal(null);
            },
            btn2Handler: () => {
              clearCanvas();
            },
          })
        }
        className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 "
      >
        <RiDeleteBin6Line className="text-[14px]" />
        <p>Reset the canvas</p>
      </div>

      <div className="py-2 border-t-2 border-b-2 border-grey-5 dark:border-opacity-20 flex flex-col gap-y-1">
        <Link to={"https://github.com/fuzailAhmad123"}>
          <div className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 ">
            <VscGithubAlt className="text-[14px]" />
            <p>GitHub</p>
          </div>
        </Link>

        <Link to={"https://x.com/FuzailAmad?t=r7JpcztGAaNrwwDYmfCyRQ&s=08"}>
          <div className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20  ">
            <RiTwitterXLine className="text-[14px]" />
            <p>Twitter</p>
          </div>
        </Link>

        <Link to={"https://www.linkedin.com/in/fuzail-ahmad121"}>
          <div className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 ">
            <RiLinkedinLine className="text-[14px]" />
            <p>LinkedIn</p>
          </div>
        </Link>

        <div
          onClick={() => setShowShareModal(true)}
          className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 lg:hidden "
        >
          <LuScreenShare className="text-[14px]" />
          <p>Share Screen</p>
        </div>

        {location !== "/" && (
          <>
            <div
              onClick={() => {
                setConfirmationModal({
                  title: "Are You sure you want to leave the room?",
                  description:
                    "You will not be able to join room again with same id. ",
                  btn1Text: "Cancel",
                  btn2Text: "Leave Room",
                  btn1Handler: () => {
                    setConfirmationModal(null);
                  },
                  btn2Handler: () => {
                    leaveRoom();
                  },
                });
              }}
              className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 xl:hidden "
            >
              <IoExitOutline className="text-[16px]" />
              <p className="w-full flex justify-between items-center">
                Leave Room
                <span className="w-[6px] h-[6px] rounded-full bg-[#D22B2B]"></span>
              </p>
            </div>

            <div
              onClick={() => {
                setUsersUpdated(false);
                setShowPopUp(true);
              }}
              className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 xl:hidden "
            >
              <FiUsers className="text-[14px]" />
              <p className="w-full flex justify-between items-center">
                Users

                <span className="flex items-center gap-x-1  ">
                <span className="w-[16px] h-[16px] rounded-[5px] bg-blue-25 dark:bg-blue-175 text-white dark:text-blue-100 text-[12px] helvetica-bold flex justify-center items-center">{users?.length}</span>
                 {usersUpdated === true &&  (<span className="w-[6px] h-[6px] rounded-full bg-[#D22B2B]"></span>)}
                </span>
              </p>
            </div>

            <div
              onClick={() => {
                setShowChats(true)
              }}
              className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer hover:bg-grey-5 dark:bg-opacity-20 xl:hidden "
            >
              <PiChatsCircle className="text-[14px]" />
              <p className="w-full flex justify-between items-center">
                Chats
                <span className="w-[16px] h-[16px] rounded-[5px] bg-blue-25 dark:bg-blue-175 text-white dark:text-blue-100 text-[12px] helvetica-bold flex justify-center items-center">{chats?.length}</span>
              </p>
            </div>
            
          </>
        )}
      </div>

      <div className="w-full h-[32px] px-3 rounded-[10px] flex items-center gap-x-2 text-[14px] text-black dark:text-grey-25 text-opacity-60 helvetica-light cursor-pointer my-1 ">
        <p>Theme</p>

        <div className="w-full h-[31px] px-1 bg-white dark:bg-black-50 border border-blue-25 dark:border-blue-175 dark:border-opacity-20 border-opacity-20 rounded-[10px] grid grid-cols-3 items-center ">
          <p
            onClick={handleLightMode}
            className={` h-[90%] w-full text-[15px] px-0.5 rounded-[10px] flex justify-center items-center ${
              theme === "light"
                ? "bg-blue-25 text-white dark:bg-blue-175 dark:text-grey-25"
                : "bg-white dark:bg-black-50 text-blue-25 dark:text-blue-175"
            } `}
          >
            <MdOutlineLightMode />
          </p>
          <p
            onClick={handleDarkMode}
            className={` h-[90%] w-full text-[15px] px-0.5 rounded-[10px] flex justify-center items-center ${
              theme === "dark"
                ? "bg-blue-25 text-white dark:bg-blue-175 dark:text-grey-25"
                : "bg-white dark:bg-black-50 text-blue-25 dark:text-blue-175"
            } `}
          >
            <MdOutlineNightlight />
          </p>
          <p
            onClick={handleSystemPreference}
            className={` h-[90%] w-full text-[15px] px-0.5 rounded-[10px] flex justify-center items-center ${
              theme === "system"
                ? "bg-blue-25 dark:bg-blue-175 dark:text-grey-25 text-white"
                : "bg-white dark:bg-black-50 text-blue-25 dark:text-blue-175"
            } `}
          >
            <GoDeviceDesktop />
          </p>
        </div>
      </div>

      {/* stroke style  */}
      <div className="my-2 w-full px-3">
        <p className="text-[10px] font-extralight text-black dark:text-grey-25 text-opacity-70 helvetica-light ">
          Canvas Background
        </p>
        <div className="w-full h-[22px] my-1  flex items-center justify-between">
          {(theme === "dark" ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches &&
              theme === "system")) === true ? (
            <div className="flex items-center gap-x-1 border-r border-grey-5 dark:border-none pr-2 ">
              {DarkCanvasColorsList.map((color, index) => (
                <div
                  key={index}
                  className={`h-[23px] w-[23px] p-[1px] rounded-[3px] ${
                    canvasColor === color
                      ? "border border-blue-100 border-opacity-50 "
                      : "border-0"
                  }`}
                >
                  <div
                    onClick={() => dispatch(setCanvasColor(color))}
                    className={`w-full h-full rounded-[3px] cursor-pointer group relative border border-grey-25 `}
                    style={{ backgroundColor: color }}
                  >
                    <p className="text-[10px] text-white bg-black-5  dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                      {color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-x-1 border-r border-grey-5 dark:border-none pr-2 ">
              {CanvasColorsList.map((color, index) => (
                <div
                  key={index}
                  className={`h-[23px] w-[23px] p-[1px] rounded-[3px] ${
                    canvasColor === color
                      ? "border border-blue-100 border-opacity-50 "
                      : "border-0"
                  }`}
                >
                  <div
                    onClick={() => dispatch(setCanvasColor(color))}
                    className={`w-full h-full rounded-[3px] cursor-pointer group relative border border-grey-25 `}
                    style={{ backgroundColor: color }}
                  >
                    <p className="text-[10px] text-white bg-black-5  dark:bg-black-50 dark:border dark:border-grey-25 dark:rounded-[3px] p-1 absolute -bottom-9 left-3 group-hover:block hidden transition-500 bg-opacity-80">
                      {color}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
