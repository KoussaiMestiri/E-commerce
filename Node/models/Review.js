const mongoose = require('mongoose')






const reviewSchema = new mongoose.Schema(
    {
      review: {
        type: String,
        required: [true, 'Review cannot be empty!']
      },
      rating: {
        type: Number,
        min: [1, 'Rating cannot be below 1.0'],
        max: [5, 'Rating cannot be above 5.0']
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      reviewedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Review must have an user']
      },
      reviewedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Review must belong to a user']
      }
    }
  );



  module.exports = mongoose.model("Review", reviewSchema);