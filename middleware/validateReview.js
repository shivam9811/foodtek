const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../JoiSchemas");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details[0].message;
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateReview;
