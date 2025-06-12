const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Route Imports
const postRoutes = require("./backend/routes/postRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const commentRoutes = require("./backend/routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/socialapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/auth", authRoutes);         // Register/Login
app.use("/posts", postRoutes);        // Post operations
app.use("/users", userRoutes);        // Follow/Unfollow/User profile
app.use("/comments", commentRoutes);  // Comment operations

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "auth.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
