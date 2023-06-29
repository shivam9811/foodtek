const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
// session package is used to make session in express

const MongoStore = require("connect-mongo");
//connect-mongo package is used to store session in the mongodb

const flash = require("connect-flash");
//connect-flash package is use to store message(like successfully or login)

const path = require("path");
//path module is required to setting the view directory

const methodOverride = require("method-override");
// package use to put and patch in client where put and patch doesnot supported for example(forms)

const ejsMate = require("ejs-mate"); //ejs-mate is the ejs engine
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
// passport is a module used to perform authentication
const LocalStrategy = require("passport-local"); //package used by passport
const monogoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
//Helmet helps you secure your Express apps by setting various HTTP headers

const User = require("./models/userModel");

const users = require("./routes/users");
const restaurant = require("./routes/restaurants");
const review = require("./routes/review");
const Restaurant = require("./models/restaurantModel");

const app = express();
const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URL
    : "mongodb://localhost:27017/foodtek"; // database url
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log("Oh NO ERRROR!!!");
    console.log(err);
  });

// mongoose connection
app.engine("ejs", ejsMate); // setting ejs engine
app.set("views", path.join(__dirname, "views"));
// setting the view directory so that we can access view directory from anywhere

app.set("view engine", "ejs"); //telling express that we are using ejs for view engine

const secret = process.env.SECRET || "secret";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});
// creating store in mongodb to store session

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
// creating a session that has a age of 7 days

app.use(session(sessionOptions));

app.use(flash()); //telling express that we are using flash

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
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// setting the current user for future records

app.use("/restaurants/:id/reviews", review); // for routing reviews of restaurants
app.use("/restaurants", restaurant); // for routing list of restaurants
app.use("/", users); // for routing users

app.get("/", async (req, res) => {
  res.render("home");
});
// routing home webpage

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
// anything else in the routes gives page not found

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});
// getting error and than to render error

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

// server listening
