const User = require("../models/User");
const Post = require("../models/Post");

const searchUsers = async (req, res) => {
  const query = req.query.query;

  try {
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar");

    res.json(users);
  } catch (error) {
    console.error("Search Users Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const searchPosts = async (req, res) => {
  const query = req.query.query;

  try {
    const posts = await Post.find({
      content: { $regex: query, $options: "i" },
    }).populate("user", "username avatar");

    res.json(posts);
  } catch (err) {
    console.error("Search Posts Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { searchUsers, searchPosts };
