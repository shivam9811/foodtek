const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// defing the schema for review

const Review = mongoose.model("Review", reviewSchema);
// creating the review model

module.exports = Review;
//exporting review model
