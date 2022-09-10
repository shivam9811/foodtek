if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const monogoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const User = require("./models/userModel");

const users = require("./routes/users");
const restaurant = require("./routes/restaurants");
const review = require("./routes/review");
const Restaurant = require("./models/restaurantModel");

const app = express();

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/foodtek";
//"mongodb://localhost:27017/foodtek"
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log("Oh NO ERRROR!!!");
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const secret = process.env.SECRET || "secret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("session store error", e);
});

const sessionOptions = {
  store: store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(monogoSanitize());
app.use(
  helmet({
    contentSecurityPolicy: false,

    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
  helmet.crossOriginEmbedderPolicy({ policy: "credentialless" })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session.returnTo);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/restaurants/:id/reviews", review);
app.use("/restaurants", restaurant);
app.use("/", users);

app.get("/", async (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("app is listening on port 8080");
});
