require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const startOverdueCron = require('./cron/overdueChecker');
const User = require('./models/User');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

const app = express();

(async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@ethara.com' });
  if (!existing) {
    const adminPass = await bcrypt.hash('password123', 10);
    const memberPass = await bcrypt.hash('password123', 10);

    const admin = await User.create({
      email: 'admin@ethara.com',
      password: adminPass,
      role: 'admin'
    });

    await User.create({
      email: 'member@ethara.com',
      password: memberPass,
      role: 'member',
      project: 'TECHNICAL',
      team: 'Fenrir'
    });

    await Task.insertMany([
      { title: 'Find gigs', projectType: 'TECHNICAL', team: 'Fenrir', priority: 'Medium', status: 'To Do', createdBy: admin._id },
      { title: 'Rate 40 prompts', projectType: 'STEM', team: 'Valor', priority: 'Medium', status: 'To Do', createdBy: admin._id },
      { title: 'Rate 40 LLM responses', projectType: 'STEM', team: 'Vindex', priority: 'Medium', status: 'To Do', createdBy: admin._id }
    ]);

    console.log('Database seeded with default users and tasks');
  }

  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/tasks', require('./routes/tasks'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/dashboard', require('./routes/dashboard'));
  app.use('/api/files', require('./routes/files'));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  startOverdueCron();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Ethara backend running on port ${PORT}`));
})();
