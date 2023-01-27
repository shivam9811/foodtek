const User = require("../models/userModel");
// importing user model

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};
//controller used for rendering Register form

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to foodTek ${registeredUser.username}`);
      res.redirect("/restaurants");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
//controller used for registering user

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};
//controller used for rendering login form

module.exports.loginUser = (req, res) => {
  const { username } = req.user;
  const redirectUrl = req.session.returnTo || "/restaurants";
  delete req.session.returnTo;
  req.flash("success", `Welcome Back ${username}`);
  res.redirect(redirectUrl);
};
//controller used for logged in user

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Successfully Logout Goodbye!!");
    res.redirect("/restaurants");
  });
};
//controller used for logged out
