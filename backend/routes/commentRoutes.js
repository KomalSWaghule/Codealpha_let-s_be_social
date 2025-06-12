const express = require('express');
const router = express.Router();

const { addComment, getComments, updateComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

// Add a comment to a post
router.post('/:postId', auth, addComment);

// Get comments for a post
router.get('/:postId', auth, getComments);

// ✅ Edit a comment
router.put('/:commentId', auth, updateComment);

module.exports = router;
