const express = require("express");
const app = express();

const server = require("http").createServer();
const { Server } = require("socket.io");
const { addUser, getUser, removeUser } = require("./utils/users");

app.use(
  cors({
    origin:'*',
    credentials: true,
  })
)
const io = new Server(server);

//routes
app.get("/", (req, res) => {
  return res.send("This is CoCreate Server");
});

let roomIdGlobal, imageUrlGlobal;
io.on("connection", (socket) => {
  //when user joined
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("allUsers", users);
    socket.broadcast.to(roomId).emit("userJoinedBroadcast", name);
    socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
      imageURL: imageUrlGlobal,
    });
  });

  //get whiteboard data
  socket.on("whiteboardData", (data) => {
    imageUrlGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imageURL: data,
    });
  });

  //chats
  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      // removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("messageResponse", {
          message,
          name: user.name,
          socketId: socket.id,
        });
    }
  });

  //update canvas color
  socket.on("canvasColorChanged",(data) => {
   socket.broadcast.to(roomIdGlobal).emit("colorChanged", {
      newColor: data,
    });
 })

  //left the room
  socket.on("leaveRoom", () => {
    const user = getUser(socket.id);
    if (user) {
      const leftUsers = removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcast", user.name);
      socket.broadcast.to(roomIdGlobal).emit("allUsers", leftUsers);
      if (user.presenter === true && user.host === true) {
        socket.broadcast.to(roomIdGlobal).emit("endRoom", true);
      }
    }
  });

  //leave the room
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      const leftUsers = removeUser(socket.id);
      socket.broadcast
        .to(roomIdGlobal)
        .emit("userLeftMessageBroadcast", user.name);
      socket.broadcast.to(roomIdGlobal).emit("allUsers", leftUsers);
      if (user.presenter === true && user.host === true) {
        socket.broadcast.to(roomIdGlobal).emit("endRoom", true);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:5000");
});
