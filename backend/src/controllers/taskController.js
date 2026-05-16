const Task = require('../models/Task');
const User = require('../models/User');

exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    } else {
      const { priority, team, project, assignedTo, status, search } = req.query;
      if (priority) query.priority = priority;
      if (team) query.team = team;
      if (project) query.projectType = project;
      if (assignedTo) query.assignedTo = assignedTo;
      if (status) query.status = status;
      if (search) {
        const memberIds = await User.find({
          $or: [
            { email: new RegExp(search, 'i') },
            { team: new RegExp(search, 'i') }
          ]
        }).select('_id');
        query.$or = [
          { title: new RegExp(search, 'i') },
          { team: new RegExp(search, 'i') },
          { projectType: new RegExp(search, 'i') },
          { assignedTo: { $in: memberIds.map(m => m._id) } }
        ];
      }
    }
    const tasks = await Task.find(query)
      .populate('assignedTo', 'email team project')
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectType, team, dueDate, dueTime, priority } = req.body;
    const files = (req.files || []).map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      path: f.path
    }));
    const task = await Task.create({
      title, description, projectType, team, dueDate, dueTime, priority, files,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'email team project')
      .populate('createdBy', 'email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'member' && (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['To Do', 'In Progress', 'Done'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'member' && (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo: userId || null, assignmentStatus: 'Active' },
      { new: true }
    ).populate('assignedTo', 'email team project');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignmentStatus: 'Cancelled', assignedTo: null },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
