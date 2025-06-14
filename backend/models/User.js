const mongoose = require('mongoose');

const Userstructure = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  profilePicture: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', Userstructure);
