const express = require("express");
const {
  addMessage,
  getAllMessage,
  deleteMessage,
} = require("../controllers/messagesController");
const messagesRouter = express();

messagesRouter.post("/addmsg", addMessage);
messagesRouter.post("/getmsg", getAllMessage);
messagesRouter.delete("/deletemsg", deleteMessage);

module.exports = messagesRouter;
