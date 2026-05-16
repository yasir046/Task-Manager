require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@ethara.com' });
  if (existing) {
    console.log('Already seeded. Exiting.');
    process.exit(0);
  }

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
    {
      title: 'Find gigs',
      projectType: 'TECHNICAL',
      team: 'Fenrir',
      priority: 'Medium',
      status: 'To Do',
      createdBy: admin._id
    },
    {
      title: 'Rate 40 prompts',
      projectType: 'STEM',
      team: 'Valor',
      priority: 'Medium',
      status: 'To Do',
      createdBy: admin._id
    },
    {
      title: 'Rate 40 LLM responses',
      projectType: 'STEM',
      team: 'Vindex',
      priority: 'Medium',
      status: 'To Do',
      createdBy: admin._id
    }
  ]);

  console.log('Seed complete!');
  console.log('Admin: admin@ethara.com / password123');
  console.log('Member: member@ethara.com / password123');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
