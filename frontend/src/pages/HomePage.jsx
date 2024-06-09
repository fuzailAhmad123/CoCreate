import React, { useEffect, useRef, useState } from "react";
import TopNavbar from "../components/common/TopNavbar/TopNavbar";
import { useSelector } from "react-redux";
import ToolDesignBar from "../components/common/ToolDesignBar/ToolDesignBar";
import Sidebar from "../components/common/SideBar/Sidebar";
import BottomControls from "../components/common/BottomControls/BottomControls";
import Canvas from "../components/core/Canvas";
import ConfirmationModal from "../components/common/Common_Modals/ConfirmationModal";
import ShareModal from "../components/common/ShareModal/ShareModal";
import { useLocation, useParams } from "react-router-dom";
import SharedImage from "../components/core/Canvas/SharedImage";
import { FaChevronLeft } from "react-icons/fa";

const HomePage = ({
  socket,
  user,
  setUser,
  confirmationModal,
  setConfirmationModal,
  setUsersUpdated,
  usersUpdated,
  setShowPopUp,
  users,
  chats,
  setShowChats,
  newColor,
}) => {
  const { showToolDesignBar, showSideBar, elements, selectedElement, action } =
    useSelector((state) => state.tool);
  const canvasRef = useRef(null);
  const {canvasColor} = useSelector((state) => state.theme);
  const ctxRef = useRef(null);
  const [history, setHistory] = useState([[]]);
  const [index, setIndex] = useState(0);
  const [state, setState] = useState({ history: [[]], index: 0 });
  const [pathName, setPathName] = useState(null);

  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

  const [showShareModal, setShowShareModal] = useState(false);
  const location = useLocation().pathname;
  useEffect(() => {
    setPathName(location);
  }, [location]);

  // console.log(users);
  return (
    <div className="w-screen h-screen relative bg-white dark:bg-black-25 "
    style={{
      backgroundColor: canvasColor
    }}>
      <TopNavbar
        setShowShareModal={setShowShareModal}
        user={user}
        pathName={pathName}
      />

      {(user?.presenter === true || pathName === "/") && (
        <>
          <div
            className={`w-[202px] h-[536px] rounded-[10px] bg-white  dark:bg-black-50 dark:border-none border border-grey-25 toolbar-shadow absolute top-[75px] left-1 transition-300 p-3 overflow-y-scroll z-[50] ${
              showToolDesignBar === true ? "block" : "hidden"
            } `}
          >
            <ToolDesignBar />
          </div>

          <div
            className={`w-[230px] h-[536px] rounded-[10px] bg-white dark:bg-black-50 dark:border-none border border-grey-25 toolbar-shadow absolute top-[75px] left-1 transition-300 p-3 overflow-y-scroll z-[100] ${
              showSideBar === true ? "block" : "hidden"
            } `}
          >
            <Sidebar
              canvasRef={canvasRef}
              ctxRef={ctxRef}
              setConfirmationModal={setConfirmationModal}
              setState={setState}
              setShowShareModal={setShowShareModal}
              setUser={setUser}
              socket={socket}
              setUsersUpdated={setUsersUpdated}
              setShowPopUp={setShowPopUp}
              usersUpdated={usersUpdated}
              users={users}
              chats={chats}
              setShowChats={setShowChats}
            />
          </div>

          <div
            className={`w-[230px] h-[36px] rounded-[10px] absolute bottom-[50px] left-1 transition-300 p-3  z-[50] flex justify-between`}
          >
            <BottomControls
              state={state}
              setState={setState}
              scale={scale}
              setScale={setScale}
            />
          </div>
        </>
      )}

      {/* whiteboard  */}
      <div className="w-full h-full ">
        {user?.presenter === true || pathName === "/" ? (
          <Canvas
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            history={history}
            setHistory={setHistory}
            index={index}
            setIndex={setIndex}
            state={state}
            setState={setState}
            scale={scale}
            setScale={setScale}
            scaleOffset={scaleOffset}
            setScaleOffset={setScaleOffset}
            user={user}
            pathName={pathName}
            socket={socket}
          />
        ) : (
          <SharedImage socket={socket} newColor={newColor} />
        )}
      </div>

      {confirmationModal && (
        <ConfirmationModal confirmationModal={confirmationModal} />
      )}

      {showShareModal && (
        <ShareModal
          setShowShareModal={setShowShareModal}
          socket={socket}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
};

export default HomePage;
