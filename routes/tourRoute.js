const express = require('express');

const {
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlans,
} = require('./../controller/tourController');
const { protect, restrictTo } = require('../controller/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tours-stats').get(getTourStats);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/monthly-plans/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlans);

router
  .route('/:id')
  .get(protect, getTour)
  .delete(protect, restrictTo('lead-guide', 'admin'), deleteTour)
  .patch(protect, restrictTo('lead-guide', 'admin'), updateTour);

module.exports = router;
