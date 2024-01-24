const MessageModel = require("../model/messageModel");
const uploadMedia = require("../utils/uploadMedia");
const addMessage = async (req, res) => {
  try {
    const { from, to, message } = req.body;
    let mediaUrl = null;

    if (req.files && req.files.length > 0) {
      const media = req.files;
      mediaUrl = await uploadMedia(media);
    }

    data = await MessageModel.create({
      message: { text: message, mediaUrl: mediaUrl },
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
        message: msg.message,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

module.exports = { addMessage, getAllMessage };
