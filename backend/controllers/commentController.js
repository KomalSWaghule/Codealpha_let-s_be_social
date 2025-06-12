const Comment = require('../models/Comment');
const User = require('../models/User');  // Adjust the path accordingly
const Post = require('../models/Post');


exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const newComment = new Comment({
      postId: req.params.postId,
      userId: req.user.id,
      text,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ...addComment, getComments already exist

exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Ensure the user owns the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.text = text;
    await comment.save();

    res.json({ message: "Comment updated successfully", comment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
