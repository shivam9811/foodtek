const Review = require("../models/reviewModel");

const isRAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You Do Not Have Permission To Do That");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};

module.exports = isRAuthor;
