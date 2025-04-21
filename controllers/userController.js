const User = require("../models/User");

const followUser = async (req, res) => {
  const userIdToFollow = req.params.id;
  const currentUserId = req.user.id;

  try {
    if (userIdToFollow === currentUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const userToFollow = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    userToFollow.followers.push(currentUserId);
    currentUser.following.push(userIdToFollow);

    await userToFollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  const userIdToUnfollow = req.params.id;
  const currentUserId = req.user.id;

  try {
    const userToUnfollow = await User.findById(userIdToUnfollow);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userToUnfollow.followers.includes(currentUserId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userIdToUnfollow.toString()
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateUserProfile = async (req, res) => {
  const { username, bio, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      bio: updateUser.bio,
      avatar: updateUser.avatar,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const searchUsers = async (req, res) => {
  const searchQuery = req.query.search;

  try {
    const users = await User.find({
      username: { $regex: searchQuery, $options: "i" },
    }).select("username avatar _id");

    res.status(200).json(users);
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers", "username avatar")
      .populate("following", "username avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  getCurrentUser
};
