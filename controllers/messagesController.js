const MessageModel = require("../model/messageModel");
const addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      res.json({ msg: "Message added successfully." });
    } else {
      res.json({ msg: "Failed to add message to the database" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const getAllMessage = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await MessageModel.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

module.exports = { addMessage, getAllMessage };
