const express = require("express");
const userRouter = express.Router();
const {
  followUser,
  unfollowUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  getCurrentUser
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");

userRouter.post("/:id/follow", protect, followUser);
userRouter.post("/:id/unfollow", protect, unfollowUser);
userRouter.get("/", searchUsers);
userRouter.get("/profile", protect, getCurrentUser);
userRouter.get("/:id", getUserProfile);
userRouter.put("/profile", protect, updateUserProfile);

module.exports = userRouter;
