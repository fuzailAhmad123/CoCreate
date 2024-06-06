import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { MdContentCopy } from "react-icons/md";

const ShareModal = ({ setShowShareModal, socket, user, setUser }) => {
  const [modalType, setModalType] = useState(1);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState(null);
  const inputRef = useRef(null);

  const {roomId} = useParams();
  useEffect(() => {
    setRoomID(roomId);
  },[roomId])
  const {
    handleSubmit,
    register,
    formState:{errors}
  } = useForm();

  const createRoom = async(data) => {
    setLoading(true);
    const roomId = uuidv4();
    const userId = uuidv4();

    const formData = {
        name:data.name,
        roomId:roomId,
        userId:userId,
        host:true,
        presenter:true
    }

    setUser(formData);
    sessionStorage.setItem("user", JSON.stringify(formData));
    navigate(`/room/${roomId}`);
    //emit event
    socket.emit("userJoined", formData);
    console.log(formData)

  }

  const joinRoom = async(data) => {
    setLoading(true);
    const userId = uuidv4();

    const formData = {
        name:data.name,
        roomId:data.link,
        userId:userId,
        host:false,
        presenter:false
    }

    setUser(formData);
    sessionStorage.setItem("user", JSON.stringify(formData));
    navigate(`/room/${data.link}`);
    //emit event
    socket.emit("userJoined", formData);
    console.log(formData)

  }

  const copyToClipboard = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleSubmission = (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 overflow-y-scroll overflow-x-hidden bg-grey-25 bg-opacity-10 backdrop-blur-sm z-[999] flex justify-center items-center ">
      <div className="w-[95%] sm:w-[80%] lg:w-[60%] xl:w-[40%] h-[70%] bg-white dark:bg-black-50 dark:border-1 dark:border-grey-75 dark:border-opacity-10   rounded-[10px] border-2 border-grey-5 shadow-md p-5">
        <div className="flex items-center justify-between">
          <p></p>
          <p
            onClick={() => setShowShareModal(false)}
            className="h-fit w-fit p-2 rounded-full hover:bg-grey-75 hover:bg-opacity-15 dark:bg-opacity-10 text-black-5 dark:text-grey-75 cursor-pointer"
          >
            <RxCross2 />
          </p>
        </div>

        <div className="w-full flex flex-col gap-y-2 mt-1 ">
          <p className=" text-blue-25 dark:text-blue-175  text-[20px] helvetica-bold w-full text-center tracking-wider ">
            Shareable Link
          </p>
          <p className="text-black-50  dark:text-grey-75 text-[14px] helvetica-light w-full text-center  ">
            Create and share a read only Link.
          </p>

        {
          (roomID === undefined || roomID === null) ? (
            <>
              {/* modal type tabs  */}
          <div className="w-full flex justify-center items-center">
            <div className="w-fit h-[30px] flex justify-center items-center gap-x-1 rounded-[5px] border border-blue-25 dark:border-grey-75 bg-opacity-10 p-0.5 cursor-pointer">
              <p
                onClick={() => setModalType(1)}
                className={`h-full  flex justify-center items-center px-2 helvetica-light text-[13px] rounded-[5px] transition-all duration-300 ${
                  modalType === 1
                    ? "bg-blue-25 dark:bg-blue-175 text-white dark:text-black-5"
                    : "bg-grey-75 bg-opacity-20 text-black-50  dark:text-grey-75"
                }`}
              >
                Create
              </p>
              <p
                onClick={() => setModalType(2)}
                className={`h-full  flex justify-center items-center px-2 helvetica-light text-[13px] rounded-[5px] transition-all duration-300 ${
                  modalType === 2
                    ? "bg-blue-25 dark:bg-blue-175 text-white dark:text-black-5"
                    : "bg-grey-75 bg-opacity-20 text-black-50  dark:text-grey-75"
                }`}
              >
                Join
              </p>
            </div>
          </div>

         {
            modalType === 1 && (
                <div className="w-full flex flex-col gap-y-3">
                    <form onSubmit={handleSubmit(createRoom)} className="mt-4">
                        <label>
                            <p className="text-[14px] text-black-50 dark:text-grey-75 helvetica-bold mb-1">Your Name</p>
                            <input
                            id="name"
                            name="name"
                            placeholder="Enter Your Name"
                            {...register("name",{required:true})}
                            className="w-full h-[30px] rounded-[5px] border border-grey-75 border-opacity-10 text-black-50 dark:text-grey-75 bg-grey-5 dark:bg-black-50 p-2 text-[13px] helvetica-light"
                            />
                        </label>

                        <button type="submit" className="w-full h-[30px] bg-blue-25 dark:bg-blue-175 helvetica-light text-[13px] text-white dark:text-black-5 rounded-[5px] flex justify-center items-center mt-4">Create Room</button>
                    </form>
                </div>
            )
         }
         {
            modalType === 2 && (
                <div className="w-full flex flex-col gap-y-3">
                    <form onSubmit={handleSubmit(joinRoom)} className="mt-4 flex flex-col gap-y-4">
                        <label>
                            <p className="text-[14px] text-black-50 dark:text-grey-75 helvetica-bold mb-1">Your Name</p>
                            <input
                            id="name"
                            name="name"
                            placeholder="Enter Your Name"
                            {...register("name",{required:true})}
                            className="w-full h-[30px] rounded-[5px] border border-grey-75 border-opacity-10 text-black-50 dark:text-grey-75 bg-grey-5 dark:bg-black-50 p-2 text-[13px] helvetica-light"
                            />
                        </label>

                        <label>
                            <p className="text-[14px] text-black-50 dark:text-grey-75 helvetica-bold mb-1">Room Link</p>
                            <input
                            id="link"
                            name="link"
                            placeholder="Enter Room Link"
                            {...register("link",{required:true})}
                            className="w-full h-[30px] rounded-[5px] border border-grey-75 border-opacity-10 text-black-50 dark:text-grey-75 bg-grey-5 dark:bg-black-50 p-2 text-[13px] helvetica-light"
                            />
                        </label>

                        <button type="submit" className="w-full h-[30px] bg-blue-25 dark:bg-blue-175 helvetica-light text-[13px] text-white dark:text-black-5 rounded-[5px] flex justify-center items-center mt-4">Join Room</button>
                    </form>
                </div>
            )
         }
            </>
          ) : (
            <div className="w-full my-5">
              <form onSubmit={handleSubmission}>
                <p className="text-[13px] helvetica-bold text-black-50 dark:text-grey-75 mb-3">Code</p>
                <input
                ref={inputRef}
                id="roomId" 
                name="roomId"
                value={roomID}
                disabled={true}
                className="w-full h-[30px] rounded-[5px] border border-grey-75 border-opacity-10 text-black-50 dark:text-grey-75 bg-grey-5 dark:bg-black-50 p-2 text-[13px] helvetica-light"
                />

                <button onClick={copyToClipboard} className="min-w-[80px] w-fit px-4 py-1 h-[30px] bg-blue-25 dark:bg-blue-175 text-white dark:text-blue-100 text-[13px] helvetica-bold rounded-[5px] flex justify-center items-center gap-x-1 mt-3">
                  <MdContentCopy />
                  Copy</button>
              </form>
            </div>
          )
        }
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
