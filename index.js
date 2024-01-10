const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(cors());
app.use(express.json());
const socket = require("socket.io");

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
    origin: "http://localhost:3000",
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
});
