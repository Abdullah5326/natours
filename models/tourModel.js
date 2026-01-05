const mongoose = require('mongoose');
const slugify = require('slugify');

const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The name of tour is required.'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must be below or equal to 40'],
      minLength: [10, 'A tour name must be above or equal to 10'],
    },
    slug: String,
    rating: {
      type: Number,
      default: 4.5,
    },
    priceDiscount: Number,
    price: {
      type: Number,
      required: [true, 'The price of tour is required.'],
      validate: {
        validator: function (val) {
          // this refers to current document in new document creation
          if (!this.priceDiscount) return true;
          return this.priceDiscount < val;
        },
        message: 'Discount should be less than price',
      },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have duration.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty.'],
      enum: {
        values: ['difficult', 'easy', 'medium'],
        message: '{VALUE} is not supported for difficulty',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have max group size.'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'A tour rating must be below 5'],
      min: [1, 'A tour rating must be above 1'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary.'],
    },
    description: {
      type: String,
      trim: true,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        address: String,
        description: String,
        day: Number,
        coordinates: [Number],
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// This middleware only runs on .save and .create not run on .insertMany
tourSchema.index({ price: 1 });
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const tourGuides = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(tourGuides);
//   Promise.all(tourGuides);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline()[0]['$match']);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
