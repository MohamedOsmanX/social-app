const jwt = require("jsonwebtoken");
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      console.log("Auth Middleware: No authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Get token from header and remove 'Bearer ' prefix if present
    const token = req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : req.headers.authorization;

    if (!token) {
      console.log("Auth Middleware: No token found in authorization header");
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Auth Middleware: Token verification successful", { userId: decoded.id });
      
      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log("Auth Middleware: User not found for token", { userId: decoded.id });
        return res.status(401).json({ message: "User not found" });
      }
      
      // Add user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error("Auth Middleware: JWT verification error", jwtError);
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      throw jwtError; // Rethrow for the outer catch block
    }
  } catch (err) {
    console.error('Auth Middleware: Unexpected error', err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;
