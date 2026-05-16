const cron = require('node-cron');
const Task = require('../models/Task');

const startOverdueCron = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const result = await Task.updateMany(
        { dueDate: { $lt: now }, status: { $nin: ['Done', 'Overdue'] } },
        { $set: { status: 'Overdue' } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Overdue cron: marked ${result.modifiedCount} tasks as overdue`);
      }
    } catch (err) {
      console.error('Overdue cron error:', err);
    }
  });
  console.log('Overdue checker cron started (runs every hour)');
};

module.exports = startOverdueCron;
