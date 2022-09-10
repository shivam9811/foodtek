const Restaurant = require("../models/restaurantModel");

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (!restaurant.author.equals(req.user._id)) {
    req.flash("error", "You Do Not Have Permission To Do That");
    return res.redirect(`/restaurants/${id}`);
  }
  next();
};

module.exports = isAuthor;
