const express = require("express");
const {
  addMessage,
  getAllMessage,
} = require("../controllers/messagesController");
const messagesRouter = express();

messagesRouter.post("/addmsg", addMessage);
messagesRouter.post("/getmsg", getAllMessage);

module.exports = messagesRouter;
