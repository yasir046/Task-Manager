const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { getUsers, createUser, getUser, deleteUser } = require('../controllers/userController');

router.get('/', auth, adminOnly, getUsers);
router.post('/', auth, adminOnly, createUser);
router.get('/:id', auth, adminOnly, getUser);
router.delete('/:id', auth, adminOnly, deleteUser);

module.exports = router;
