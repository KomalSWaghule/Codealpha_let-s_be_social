const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require('../models/User');
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============================
// Multer config for image uploads
// ============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only images are allowed (jpg, jpeg, png, gif)"));
  }
});

// ============================
// GET all posts (public)
// ============================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============================
// POST create new post (protected)
// ============================
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Post content is required" });
  }

  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({
      content,
      image: imagePath,
      userId: req.user.id,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error saving post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// POST like/unlike a post (protected)
// ============================
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "Like/unlike successful", likes: post.likes.length });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ============================
// GET posts by user ID (protected)
// ============================
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// DELETE a post by ID (protected)
// ============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    // Delete image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, "..", post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
