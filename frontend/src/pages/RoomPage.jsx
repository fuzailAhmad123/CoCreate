import React, { useEffect, useState } from "react";
import HomePage from "./HomePage";
import UsersModal from "../components/common/Modals/UsersModal";
import { useLocation, useNavigate } from "react-router-dom";
import ChatsModal from "../components/common/Modals/ChatsModal";

const RoomPage = ({
  user,
  setUser,
  socket,
  users,
  usersUpdated,
  setUsersUpdated,
  chats,
  setChats,
  confirmationModal,
  setConfirmationModal,
  newColor
}) => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const [showChats, setShowChats] = useState(false);

  // fire an event when left the room
  useEffect(() => {
    return () => {
      socket.emit("userLeft", user);
    };
  }, []);

  const leaveRoom = () => {
    socket.emit("leaveRoom", null);
    setUser(null);
    sessionStorage.setItem("user", null);
    navigate("/");
    setConfirmationModal(null);
  };
  return (
    <div className="min-h-screen min-w-screen relative">
      {users?.length > 0 && path !== "/" && (
        <div className="w-full h-[36px] z-[100] hidden xl:flex justify-end gap-x-4 pr-[120px] absolute top-4 left-0">
          <div
            onClick={() => {
              setUsersUpdated(false);
              setShowPopUp(true);
            }}
            className="w-[80px] h-[36px] rounded-[10px] bg-blue-25 dark:bg-blue-175 flex justify-center items-center p-0.5 relative z-[300] hover:cursor-pointer"
          >
            <div className="w-[26px] h-[26px] rounded-full border-2 border-grey-5 dark:border-blue-100 bg-grey-5 dark:bg-blue-100 dark:bg-opacity-20 bg-opacity-30 flex justify-center items-center absolute top-[5px] left-[5px] overflow-hidden z-[10]">
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${users[0].name
                  .split(" ")
                  .at("0")}`}
                alt=""
              />
            </div>
            <div className="w-[26px] h-[26px] rounded-full border-2 border-grey-5  dark:border-blue-100 bg-grey-5 dark:bg-blue-100 dark:bg-opacity-20 bg-opacity-30 flex justify-center items-center absolute top-[5px] left-[20px] overflow-hidden z-[8]">
              <img
                src={
                  users[1] !== undefined
                    ? `https://api.dicebear.com/5.x/initials/svg?seed=${users[1].name
                        .split(" ")
                        .at("0")}`
                    : ""
                }
                alt=""
              />
            </div>
            <div className="w-[26px] h-[26px] rounded-full border-2 border-grey-5  dark:border-blue-100 bg-grey-5 dark:bg-blue-100 dark:bg-opacity-20 bg-opacity-30 flex justify-center items-center absolute top-[5px] left-[35px] overflow-hidden z-[6]">
              <img
                src={
                  users[2] !== undefined
                    ? `https://api.dicebear.com/5.x/initials/svg?seed=${users[2].name
                        .split(" ")
                        .at("0")}`
                    : ""
                }
                alt=""
              />
            </div>
            {usersUpdated === true && (
              <div className="w-[10px] h-[10px] rounded-full absolute -top-1 right-1 bg-[#D22B2B]"></div>
            )}
          </div>

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
            className="w-fit min-w-[60px] px-2 h-[36px] bg-blue-25 dark:bg-blue-175 text-white dark:text-blue-100 rounded-[10px] cursor-pointer flex justify-center items-center font-extralight dark:font-normal "
          >
            Leave
          </div>
        </div>
      )}

      <HomePage
        user={user}
        setUser={setUser}
        socket={socket}
        users={users}
        confirmationModal={confirmationModal}
        setConfirmationModal={setConfirmationModal}
        usersUpdated={usersUpdated}
        setUsersUpdated={setUsersUpdated}
        setShowPopUp={setShowPopUp}
        chats={chats}
        setShowChats={setShowChats}
        newColor={newColor}
      />

      {users?.length > 0 && path !== "/" && (
        <>
          <UsersModal
            users={users}
            setShowPopUp={setShowPopUp}
            showPopUp={showPopUp}
            user={user}
            setUsersUpdated={setUsersUpdated}
            socket={socket}
            setUser={setUser}
          />

          <ChatsModal
            chats={chats}
            showChats={showChats}
            setShowChats={setShowChats}
            user={user}
            socket={socket}
            setChats={setChats}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
