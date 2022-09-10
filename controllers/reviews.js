const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");

module.exports.addReview = async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  restaurant.reviews.push(review);
  await review.save();
  await restaurant.save();
  req.flash("success", "New review added");
  res.redirect(`/restaurants/${id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");

  res.redirect(`/restaurants/${id}`);
};
