const express = require('express');
const { protect } = require('../controller/authController');
const { getCheckoutSession } = require('../controller/bookingController');

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
