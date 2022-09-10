const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true });

const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");
const isLoggedIn = require("../middleware/isLoggedIn");
const validateReview = require("../middleware/validateReview");
const isRAuthor = require("../middleware/isRAuthor");

const { addReview, deleteReview } = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(addReview));

router.delete("/:reviewId", isLoggedIn, isRAuthor, catchAsync(deleteReview));

module.exports = router;
