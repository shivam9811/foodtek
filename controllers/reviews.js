const Review = require("../models/reviewModel");
//importing review model
const Restaurant = require("../models/restaurantModel");
//importing restaurant model

module.exports.addReview = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id; // adding review author save for further operataion like deletion
  restaurant.reviews.push(review);
  await review.save();
  await restaurant.save();
  req.flash("success", "New review added");
  res.redirect(`/restaurants/${id}`);
};
//contoller to add review

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");

  res.redirect(`/restaurants/${id}`);
};
//controller to delete review
