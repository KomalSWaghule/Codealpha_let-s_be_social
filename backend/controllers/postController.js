
const Post = require('../models/Post');
const User = require('../models/User');  



exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = new Post({ userId: req.user.id, content, image });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
      res.json({ message: "Liked" });
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      await post.save();
      res.json({ message: "Unliked" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
