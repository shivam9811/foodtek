const express = require("express");
const Restaurant = require("../models/restaurantModel");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

const isLoggedIn = require("../middleware/isLoggedIn");
const validateRestaurant = require("../middleware/validateRestaurant");
const isAuthor = require("../middleware/isAuthor");

const {
  index,
  renderNewForm,
  createNewRestaurant,
  findRestaurantById,
  updateRestaurant,
  renderEditForm,
  deleteRestaurant,
} = require("../controllers/restaurants");

router
  .route("/")
  .get(catchAsync(index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateRestaurant,
    catchAsync(createNewRestaurant)
  );

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(catchAsync(findRestaurantById))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateRestaurant,
    catchAsync(updateRestaurant)
  )
  .delete(isLoggedIn, isAuthor, isLoggedIn, catchAsync(deleteRestaurant));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;
