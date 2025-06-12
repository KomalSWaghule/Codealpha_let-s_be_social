const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers following', 'username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user.id);

    if (!target || !current) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (target._id.equals(current._id)) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    if (target.followers.includes(current._id)) {
      return res.status(400).json({ message: 'Already following this user.' });
    }

    target.followers.push(current._id);
    current.following.push(target._id);

    await target.save();
    await current.save();

    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    const current = await User.findById(req.user.id);

    if (!target || !current) {
      return res.status(404).json({ message: 'User not found' });
    }

    target.followers = (target.followers || []).filter(id => id.toString() !== req.user.id);
    current.following = (current.following || []).filter(id => id.toString() !== req.params.id);

    await target.save();
    await current.save();

    res.json({ message: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
