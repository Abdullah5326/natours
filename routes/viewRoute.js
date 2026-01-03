const express = require('express');
const viewsController = require('../controller/viewController');
const { protect, isLoggedIn } = require('../controller/authController');

const router = express.Router();

router.get('/me', protect, viewsController.getAccount);
router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.post('/update-user-data', protect, viewsController.updateUserData);

module.exports = router;
