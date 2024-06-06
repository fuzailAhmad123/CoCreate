import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiSolidMessageRoundedDots } from "react-icons/bi";
import { MdKeyboardArrowUp } from "react-icons/md";
import { useForm } from "react-hook-form";

const ChatsModal = ({ showChats, setShowChats, chats, user, socket, setChats }) => {
    const {
        register,
        handleSubmit,
        formState:{errors},
        setValue
    } = useForm();

    const sendMessage = data => {
        setChats((prev) => [...prev, {message : data?.message, name: user?.name, socketId : user?.socketId}]);
        socket.emit("message", {message : data?.message});
        setValue("message", "");
    }
  return (
    <div
      className={` ${
        showChats === true
          ? "h-[500px]  w-[80%] custom-sm:w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%] custom-lg:w-[20%] z-[400]"
          : "h-[36px] w-[80px] z-[300]"
      } bg-white dark:bg-black-50 rounded-t-[10px] shadow-md dark:border-none  border-2 border-grey-5 mx-3 overflow-hidden absolute bottom-0 right-16 sm:right-32 transition-all duration-300 flex flex-col justify-between pb-2`}
    >
        {/* top bar  */}
      <div
        className={`w-full min-h-[36px] bg-blue-25 dark:bg-blue-175 px-3 ${
          showChats === true
            ? " flex items-center justify-between"
            : " flex items-center center gap-x-1"
        }`}
      >
        <p
          className={`text-white dark:text-blue-100 text-[13px] helvetica-bold ${
            showChats === true ? "block" : "hidden"
          }`}
        >
          Total Messages : {chats?.length}
        </p>
        <p
          className={`text-white dark:text-blue-100  contain-paint text-[20px] p-1 rounded-full hover:bg-grey-5 hover:bg-opacity-25 ${
            showChats === true ? "block" : "hidden"
          }`}
          onClick={() => setShowChats(false)}
        >
          <RiArrowDropDownLine />
        </p>

        <p
          className={`text-white dark:text-blue-100 contain-paint text-[16px] p-1 rounded-full ${
            showChats === false ? "block" : "hidden"
          }`}
        >
          <BiSolidMessageRoundedDots />
        </p>

        <p
          className={`text-white dark:text-blue-100 contain-paint text-[16px] p-1 rounded-full hover:bg-grey-5 hover:bg-opacity-25 ${
            showChats === false ? "block" : "hidden"
          }`}
          onClick={() => {
            setShowChats(true);
            // setUsersUpdated(false);
          }}
        >
          <MdKeyboardArrowUp />
        </p>
      </div>

      {/* chats  */}
      <div className={`w-full h-[400px] overflow-y-scroll  gap-2 py-4 px-2 overflow-hidden ${showChats === true ? "flex flex-col" : "hidden"}`}>
         {
            chats.map((chat, index) => (
                <div key={index} className={`w-[90%] h-fit p-0.5 min-h-[36px] flex items-center gap-x-2 rounded-[10px] px-1 bg-opacity-50 ${chat.socketId === user?.socketId ? "bg-blue-25 flex-row ml-auto" : "bg-grey-75 flex-row mr-auto  "}`}>
                    <div className="min-w-[24px] h-[24px] rounded-full bg-grey-5 bg-opacity-30 flex justify-center items-center overflow-hidden ">
                        <img src={`https://api.dicebear.com/5.x/initials/svg?seed=${chat.name.split(" ").at("0")}`} alt="" />
                    </div>
                    <p className="text-[15px] text-black-50 dark:text-grey-75 helvetica-oblique">{chat.message}</p>
                </div>
            ))
         }
      </div>

      {/* message input form  */}
      <form onSubmit={handleSubmit(sendMessage)} className={`w-full h-[40px] items-center justify-between p-2 ${showChats === true ? "flex" : "hidden"}`}>
             <input
              id="message"
              name="message"
              placeholder="Message...."
              className="w-[70%] h-[40px] border-2 border-grey-25 bg-white dark:bg-black-50 rounded-[10px] p-2 text-black-50 dark:text-grey-75 helvetica-oblique placeholder:text-grey-50 dark:placeholder:text-grey-75 overflow-hidden "
              {...register("message", {required:true})}
             />
             <button type="submit" className="w-[70px] h-[40px] text-[13px] text-white dark:text-blue-100 rounded-[10px] bg-blue-25 dark:bg-blue-175 z-[400]">Send</button>
      </form>
    </div>
  );
};

export default ChatsModal;
