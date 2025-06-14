

const mongoose = require('mongoose');

const Commentstructure = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', Commentstructure);
