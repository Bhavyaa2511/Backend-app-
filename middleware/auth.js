const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization'); // Extract token from the Authorization header
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const verified = jwt.verify(token, SECRET_KEY); // Verify the token
    req.user = verified; // Attach user details to the request object
    next(); // Pass control to the next middleware/route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
