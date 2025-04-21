const express = require("express");
const postRouter = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  updateComment,
  getFeed,
  updatePost,
  deletePost
} = require("../controllers/postController");
const protect = require("../middlewares/authMiddleware");

postRouter.post("/create", protect, createPost); // POST /api/posts
postRouter.get("/", protect, getAllPosts);
postRouter.get("/user/:id", protect, getUserPosts);
postRouter.put("/:id/like", protect, likePost);
postRouter.put("/:id/unlike", protect, unlikePost);
postRouter.post("/:id/comments", protect, addComment);  
postRouter.delete("/:id/comments/:commentId", protect, deleteComment);
postRouter.put("/:id/comments/:commentId", protect, updateComment);
postRouter.get("/feed", protect, getFeed);
postRouter.put('/:id/update', protect, updatePost);
postRouter.delete('/:id/delete', protect, deletePost);


module.exports = postRouter;
