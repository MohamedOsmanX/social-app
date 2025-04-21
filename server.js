const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRoutes");
const userRouter = require('./routes/userRoutes');  
const postRouter = require('./routes/postRoutes')

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter)

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas ✅"))
  .catch((err) => console.error("MongoDB connection error ❌:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
