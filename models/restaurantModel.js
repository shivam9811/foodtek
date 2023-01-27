const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviewModel");

const ImageSchema = new Schema({
  url: {
    type: String,
  },
  filename: {
    type: String,
  },
});
//creating ImageSchema

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_thumb,w_200,h_200");
});

const RestaurantSchema = new Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  images: [ImageSchema],
  price: {
    type: Number,
  },
  geoLocation: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
//creating restaurantSchema

RestaurantSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
//creating a Restaurant model

module.exports = Restaurant;
// exports restaurants model
