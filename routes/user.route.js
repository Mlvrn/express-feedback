const express = require('express');
const {
  getUsers,
  getUserById,
  userRegister,
  userLogin,
  editProfile,
  changePassword,
  forgotPassword,
  deleteUser,
} = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authentication');
const { authorizeAdmin } = require('../middlewares/authorization');
const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/forgotPassword', forgotPassword);

router.use(authenticate);
router.get('/all', authorizeAdmin, getUsers);
router.get('/', getUserById);
router.put('/profile/edit', editProfile);
router.put('/profile/changePassword', changePassword);
router.delete('/:userId', authorizeAdmin, deleteUser);

module.exports = router;
