import React from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UsersModal = ({
  users,
  setShowPopUp,
  showPopUp,
  user,
  setUsersUpdated,
  socket,
  setUser,
}) => {
  const navigate = useNavigate();
  const leaveRoom = () => {
    socket.emit("leaveRoom", null);
    setUser(null);
    sessionStorage.setItem("user", null);
    navigate("/");
  };
  return (
    <div
      className={` ${
        showPopUp === true
          ? "h-[500px] w-[80%] custom-sm:w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%] custom-lg:w-[20%] z-[400]"
          : "h-[36px] w-[80px] z-[300]"
      } bg-white dark:bg-black-50  rounded-t-[10px] shadow-md dark:border-none border-2 border-grey-5 mx-3 overflow-hidden absolute bottom-0 right-0 sm:right-10 transition-all duration-300 `}
    >
      <div
        className={`w-full h-[36px] bg-blue-25 dark:bg-blue-175 px-3 ${
          showPopUp === true
            ? " flex items-center justify-between"
            : " flex items-center center gap-x-1"
        }`}
      >
        <p
          className={`text-white dark:text-blue-100 text-[13px] helvetica-bold ${
            showPopUp === true ? "block" : "hidden"
          }`}
        >
          Total Users : {users?.length}
        </p>
        <p
          className={`text-white dark:text-blue-100 contain-paint text-[20px] p-1 rounded-full hover:bg-grey-5 hover:bg-opacity-25 ${
            showPopUp === true ? "block" : "hidden"
          }`}
          onClick={() => setShowPopUp(false)}
        >
          <RiArrowDropDownLine />
        </p>

        <p
          className={`text-white dark:text-blue-100 contain-paint text-[14px] p-1 rounded-full ${
            showPopUp === false ? "block" : "hidden"
          }`}
        >
          <FaUser />
        </p>

        <p
          className={`text-white dark:text-blue-100 contain-paint text-[16px] p-1 rounded-full hover:bg-grey-5 hover:bg-opacity-25 ${
            showPopUp === false ? "block" : "hidden"
          }`}
          onClick={() => {
            setShowPopUp(true);
            setUsersUpdated(false);
          }}
        >
          <MdKeyboardArrowUp />
        </p>
      </div>

      <div className="w-full max-h-[360px] min-h-[360px] p-4 flex flex-col gap-y-4 overflow-y-scroll">
        {users?.length > 0 ? (
          users.map((usr, index) => (
            <div
              key={index}
              className="w-full py-2 flex items-start justify-start gap-x-2 cursor-pointer hover:bg-grey-75 hover:bg-opacity-30 px-1 rounded-md "
            >
              <div className="w-[24px] h-[24px] rounded-full flex justify-center items-center overflow-hidden">
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${usr.name
                    .split(" ")
                    .at("0")}`}
                  alt=""
                />
              </div>
              <p className="text-[15px] helvetica-light text-black-5 dark:text-grey-75 flex items-center gap-x-4 ">
                {usr?.name}
                {usr?.userId === user?.userId && (
                  <span className="w-[8px] h-[8px] bg-[#0BDA51] rounded-full"></span>
                )}
              </p>
            </div>
          ))
        ) : (
          <p>No Users</p>
        )}
      </div>

  {
    (user?.host !== true && user?.presenter !== true && showPopUp !== false) && (
      <div className="w-full h-[36px] flex items-center justify-end px-2 ">
      <button
        onClick={leaveRoom}
        className="w-fit px-4 h-[36px] flex justify-center items-center bg-blue-25 dark:bg-blue-175 text-white dark:text-blue-100 text-[13px] cursor-pointer rounded-[5px]  "
      >
        Leave
      </button>
    </div>
    )
  }
    </div>
  );
};

export default UsersModal;
