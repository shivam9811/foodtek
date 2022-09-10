const ExpressError = require("../utils/ExpressError");
const { restaurantSchema } = require("../JoiSchemas");

const validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) {
    const msg = error.details[0].message;
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateRestaurant;
