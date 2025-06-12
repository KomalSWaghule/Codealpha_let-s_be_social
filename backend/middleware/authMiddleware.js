const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Use lowercase 'authorization' header name as HTTP headers are case-insensitive, but lowercase is standard in Node.js
  const authHeader = req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Check if the header has the expected "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach decoded token payload (typically includes user id)
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
