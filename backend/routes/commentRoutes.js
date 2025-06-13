const express = require('express');
const router = express.Router();

const { addComment, getComments, updateComment } = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');


router.post('/:postId', auth, addComment);

router.get('/:postId', auth, getComments);

router.put('/:commentId', auth, updateComment);

module.exports = router;
