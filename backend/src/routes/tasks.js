const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');
const {
  getTasks, createTask, getTask, updateStatus, assignTask, cancelTask, deleteTask
} = require('../controllers/taskController');

router.get('/', auth, getTasks);
router.post('/', auth, adminOnly, upload.array('files', 10), createTask);
router.get('/:id', auth, getTask);
router.patch('/:id/status', auth, updateStatus);
router.patch('/:id/assign', auth, adminOnly, assignTask);
router.patch('/:id/cancel', auth, adminOnly, cancelTask);
router.delete('/:id', auth, adminOnly, deleteTask);

module.exports = router;
