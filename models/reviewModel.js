const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must  belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  this.populate({
    path: 'tour',
  });
  next();
});

reviewSchema.statics.calcRatingAvg = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats[0])
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAvg: stats[0].avgRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingAvg: 4.5,
    });
};

reviewSchema.post('save', function () {
  this.constructor.calcRatingAvg(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getFilter());
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcRatingAvg(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
