const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { email, password, project, team } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  try {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      role: 'member',
      project: project || undefined,
      team: team || undefined
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role, project: user.project, team: user.team }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role, project: user.project, team: user.team }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    project: req.user.project,
    team: req.user.team
  });
};
