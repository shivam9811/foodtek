const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

const {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} = require("../controllers/users");

router
  .route("/register")
  .get(renderRegisterForm)
  .post(catchAsync(registerUser));

// router.get("/register", renderRegisterForm);

// router.post("/register", catchAsync(registerUser));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    loginUser
  );

// router.get("/login", renderLoginForm);

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/login",
//     keepSessionInfo: true,
//   }),
//   loginUser
// );

router.get("/logout", logoutUser);

module.exports = router;
