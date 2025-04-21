const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Register Controller: Registration attempt', { username, email });
    
    // Validate input
    if (!username || !email || !password) {
      console.log('Register Controller: Missing required fields');
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log('Register Controller: User already exists', { 
        existingEmail: userExists.email, 
        existingUsername: userExists.username 
      });
      return res.status(400).json({ message: "User already exists" });
    }

    console.log('Register Controller: Creating new user');
    const user = await User.create({ username, email, password });
    const token = generateToken(user);

    console.log('Register Controller: User created successfully', { userId: user._id });
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token, // Send token without Bearer prefix
    });
  } catch (error) {
    console.error("Register Controller: Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    console.log('Login Controller: Login attempt', { emailOrUsername });
    
    // Validate input
    if (!emailOrUsername || !password) {
      console.log('Login Controller: Missing required fields');
      return res
        .status(400)
        .json({ message: "Please provide email/username and password" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      console.log('Login Controller: User not found', { emailOrUsername });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login Controller: Invalid password for user', { 
        userId: user._id, 
        username: user.username 
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    console.log('Login Controller: Login successful', { userId: user._id, username: user.username });

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: token, // Send token without Bearer prefix
    });
  } catch (error) {
    console.error("Login Controller: Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
