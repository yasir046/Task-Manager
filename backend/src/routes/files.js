const router = require('express').Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

// Support both Bearer header and ?token= query param (for browser downloads)
const resolveUser = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/:filename', resolveUser, async (req, res) => {
  const { filename } = req.params;
  if (req.user.role !== 'admin') {
    const task = await Task.findOne({ 'files.filename': filename });
    if (!task || !task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
  }
  const filePath = path.join(__dirname, '../../uploads', filename);
  res.sendFile(filePath, err => {
    if (err) res.status(404).json({ message: 'File not found' });
  });
});

module.exports = router;
