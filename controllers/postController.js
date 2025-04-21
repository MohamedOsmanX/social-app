const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      user: req.user._id,
      content,
      image,
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get All Posts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ user: userId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get User Posts Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "Already liked this post" });
    }

    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();
    res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error("Unlike Post Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);

    await post.save();

    res.status(201).json({ message: "Comment added" });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comment" });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure the user is the one who posted the comment (optional)
    if (comment.user.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }

    comment.text = text; // Update the comment text

    await post.save(); // Save the post with the updated comment

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    console.error("Update Comment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("following");

    const allUserIds = [userId, ...user.following];

    const feedPosts = await Post.find({ user: { $in: allUserIds } })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.error("Get Feed Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, image } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (content) post.content = content;
    if (image) post.image = image;

    await post.save();
    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
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
};
