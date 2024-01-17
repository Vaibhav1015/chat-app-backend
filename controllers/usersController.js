const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const Mailgen = require("mailgen");
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail' or use your SMTP details
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Chat-App",
    link: "https://chat-app-fun.netlify.app/",
  },
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ status: false, message: "Username already used." });
    }

    const userEmailCheck = await User.findOne({ email });
    if (userEmailCheck) {
      return res.json({ status: false, message: "Email already used." });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPass,
    });

    delete user.password;

    const response = {
      body: {
        name: username,
        intro:
          "Congratulations! Your registration with Chat-App has been successfully processed, and your account is now active.",
        action: {
          instructions: `Your assigned username for logging in is: ${username}`,
          button: {
            color: "green",
            text: "Get Started",
            link: "https://chat-app-fun.netlify.app/",
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const mail = MailGenerator.generate(response);
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: "New account created",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res.status(201).json({ status: true, user });
      })
      .catch((error) => {
        return res.status(500).json({ status: false });
      });

    // res.json({ status: true, user });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.json({
        status: false,
        message: "Username or password is incorrect.",
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.json({ status: false, message: "Username or password incorrect" });
      } else {
        delete user.password;
        res.json({ status: true, user });
      }
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

const setAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });

    res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    res.json(users);
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

module.exports = { register, login, setAvatar, getAllUsers };
