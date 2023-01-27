const Restaurant = require("../models/restaurantModel");
const { cloudinary } = require("../cloudinary");
const axios = require("axios");
const { getGeo } = require("../middleware/getGeo");

module.exports.index = async (req, res) => {
  const restaurants = await Restaurant.find();
  const geoLocations = [];
  const names = [];
  for (let restaurant of restaurants) {
    geoLocations.push(restaurant.geoLocation);
  }
  for (let restaurant of restaurants) {
    names.push(restaurant.name);
    names.push(restaurant._id);
  }
  res.render("restaurants/index", { restaurants, names, geoLocations });
};
//controller to show a list of restaurants

module.exports.renderNewForm = (req, res) => {
  res.render("restaurants/new");
};
//controller to render a form for new restaurant

module.exports.createNewRestaurant = async (req, res, next) => {
  const restaurant = new Restaurant(req.body.restaurant);
  restaurant.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.author = req.user._id;
  const geoLocation = await getGeo(restaurant.location);
  restaurant.geoLocation = geoLocation;
  await restaurant.save();
  req.flash("success", "Successfully made a new restaurant");
  res.redirect(`/restaurants/${restaurant._id}`);
};
//controller to create a new restaurant

module.exports.findRestaurantById = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id)
    .populate({
      path: "reviews",
      populate: {
        //to populate review's author
        path: "author",
      },
    })
    .populate("author");
  if (!restaurant) {
    req.flash("error", "Cannot find that restaurant");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/show", { restaurant });
};
//controller to find a restaurant by id

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    req.flash("error", "Cannot find that restaurant");
    return res.redirect("/restaurants");
  }
  res.render("restaurants/edit", { restaurant });
};
//controller to render an edit form

module.exports.updateRestaurant = async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findByIdAndUpdate(
    id,
    req.body.restaurant,
    {
      new: true,
    }
  );
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  restaurant.images.push(...images);
  await restaurant.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await restaurant.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated a restaurant");
  res.redirect(`/restaurants/${restaurant.id}`);
};

// controller to update the restaurant details

module.exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  await Restaurant.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted restaurant");
  res.redirect("/restaurants");
};
// controller to delete the restaurants
