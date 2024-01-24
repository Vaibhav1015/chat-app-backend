const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const socket = require("socket.io");
const multer = require("multer");
const upload = multer();

app.use(upload.any());

//Mongodb connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

//Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

const messageRoute = require("./routes/messagesRoute");
app.use("/api/messages", messageRoute);

// Server listen
const port = process.env.PORT;
const server = app.listen(port || 3001, () => {
  console.log(`Server listening on port ${port}`);
});

//Socket.io connection
const io = socket(server, {
  cors: {
    // origin: "https://chat-app-fun.netlify.app", //"http://localhost:3000"
    origin: process.env.SOCKET_ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });

  // Handle sending media messages
  socket.on("send-media", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      // You might want to send more information about the media, e.g., file type, size, etc.
      const mediaMessage = { mediaUrl: data.media };
      socket.to(sendUserSocket).emit("media-recieve", mediaMessage);
    }
  });
});
