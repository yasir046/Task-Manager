const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { tasksByTeam, tasksByStatus, tasksPerUser, overdueByTeam } = require('../controllers/dashboardController');

router.get('/tasks-by-team', auth, adminOnly, tasksByTeam);
router.get('/tasks-by-status', auth, adminOnly, tasksByStatus);
router.get('/tasks-per-user', auth, adminOnly, tasksPerUser);
router.get('/overdue-by-team', auth, adminOnly, overdueByTeam);

module.exports = router;
