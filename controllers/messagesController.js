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
      res.json({ msg: "Message added successfully.", data });
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
        _id: msg._id,
        createdAt: msg.createdAt,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageIds } = req.body;

    // Validate messageIds
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: "Invalid messageIds" });
    }

    // Delete messages
    const deletedRes = await MessageModel.deleteMany({
      _id: { $in: messageIds },
    });

    res
      .status(200)
      .json({ message: "Messages deleted successfully", deletedRes });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addMessage, getAllMessage, deleteMessage };
