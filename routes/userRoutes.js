const express = require("express");
const userRouter = express();
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/usersController");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/setAvatar/:id", setAvatar);
userRouter.get("/allusers/:id", getAllUsers);

module.exports = userRouter;
