const Task = require('../models/Task');

exports.tasksByTeam = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: { project: '$projectType', team: '$team' }, count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.tasksByStatus = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.tasksPerUser = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 }, tasks: { $push: '$title' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { user: { email: 1, project: 1, team: 1 }, count: 1, tasks: 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.overdueByTeam = async (req, res) => {
  try {
    const result = await Task.aggregate([
      { $match: { status: 'Overdue' } },
      { $group: { _id: '$team', count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
