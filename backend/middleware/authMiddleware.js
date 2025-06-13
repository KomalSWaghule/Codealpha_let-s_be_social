const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
 
  const authHeader = req.header('authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  
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
    req.user = verified; 
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
