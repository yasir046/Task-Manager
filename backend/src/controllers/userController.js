const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'member' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, project, team } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: 'member', project, team });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
