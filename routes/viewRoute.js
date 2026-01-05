const express = require('express');
const viewsController = require('../controller/viewController');
const { protect, isLoggedIn } = require('../controller/authController');
const { createBookingCheckout } = require('../controller/bookingController');

const router = express.Router();

router.get('/me', protect, viewsController.getAccount);
router.get('/', isLoggedIn, createBookingCheckout, viewsController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.post('/update-user-data', protect, viewsController.updateUserData);
router.get('/my-tours', protect, viewsController.getMyTours);

module.exports = router;
