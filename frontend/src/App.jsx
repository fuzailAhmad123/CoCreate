import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import io from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { TbBrandSocketIo } from "react-icons/tb";

const server = import.meta.env.BACKEND_URL;
console.log("server_url  : ", server);

if(!server){
  throw new Error("Server URL not found")
}
  const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };
  
  const socket = io(server, connectionOptions);       

function App() {
  const {canvasColor, theme} = useSelector((state) => state.theme);
  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null
  );
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersUpdated, setUsersUpdated] = useState(false);
  const [chats, setChats] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [newColor, setNewColor] = useState("");

  useEffect(() => {
    socket.on("userJoined", (data) => {
      if (data.success) {
        console.log("User Joined Successfully");
        setUsers(data.users);
        setUsersUpdated(true);
      } else {
        console.log("Error occurred while joining user.");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
      setUsersUpdated(true);
    });

    socket.on("userJoinedBroadcast", (data) => {
      toast.info(`${data} joined the room.`);
    });

    socket.on("userLeftMessageBroadcast", (data) => {
      toast.info(`${data} left the room.`);
    });

    socket.on("messageResponse", (data) => {
      setChats( prev =>  [...prev, data]);
      toast.info(` ${data.name} sent a message in chat.`);
      setChatsUpdated(true);
    })

    socket.on("endRoom", () => {
      toast.info(`Room has been ended by the host`);
      navigate("/");
    })

    socket.on("colorChanged", (data) => {
         setNewColor(data.newColor);
    })
  }, []);

  useEffect(() => {
    if(user?.presenter === true && user?.host === true){
      socket.emit("canvasColorChanged", canvasColor );
    }
  }, [theme, canvasColor]);

  return (
    <div className="w-screen h-screen bg-white dark:bg-black-25 relative">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<HomePage socket={socket} user={user} setUser={setUser} confirmationModal={confirmationModal} setConfirmationModal={setConfirmationModal} newColor={newColor} />}
        />
        <Route
          path="/room/:roomId"
          element={
            <RoomPage
              user={user}
              setUser={setUser}
              socket={socket}
              users={users}
              usersUpdated={usersUpdated}
              setUsersUpdated={setUsersUpdated}
              chats={chats}
              setChats={setChats}
              confirmationModal={confirmationModal}
              setConfirmationModal={setConfirmationModal}
              newColor={newColor}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
