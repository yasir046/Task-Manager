const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], required: true },
  project: { type: String, enum: ['STEM', 'NON_STEM', 'TECHNICAL'] },
  team: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
