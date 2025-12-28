const express = require('express');

const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('./../controller/userController');
const {
  signUpUser,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controller/authController');
const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.use(protect);
router.patch('/updatePassword/:id', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);

router.use(restrictTo('admin'));
router.route('/').get(getAllUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
