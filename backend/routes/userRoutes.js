const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Adjust the path accordingly
const Post = require('../models/Post');

const { getUserProfile, followUser, unfollowUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/:id', auth, getUserProfile);
router.post('/:id/follow', auth, followUser);
router.post('/:id/unfollow', auth, unfollowUser);

module.exports = router;
