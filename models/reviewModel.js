// review /rating / createdAt / ref to tour / ref to user

const mongose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongose.Schema(
  {
    review: {
      type: String,
      //   min: [124, 'Please write minimmum of 218 character'],
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A Review Must have a Tour: ID']
    },
    user: {
      type: mongose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review Must have a User:ID']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  //this points to current review model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  //await this.findOne(); this NOT work here , query allready executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongose.model('Review', reviewSchema);

module.exports = Review;
