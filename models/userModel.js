const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// creating user schema

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
// creating user model

module.exports = User;
