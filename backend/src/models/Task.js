const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimetype: String,
  path: String
}, { _id: false });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  projectType: { type: String, enum: ['STEM', 'NON_STEM', 'TECHNICAL'] },
  team: String,
  dueDate: Date,
  dueTime: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done', 'Overdue'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignmentStatus: { type: String, enum: ['Active', 'Cancelled'], default: 'Active' },
  files: [fileSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
