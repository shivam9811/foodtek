const mongoose = require("mongoose");
const Restaurant = require("../models/restaurantModel");
const { places, descriptors } = require("./seedHelper");
const cities = require("./in2");
const images = require("./images");

mongoose
  .connect("mongodb://localhost:27017/foodtek")
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log("oh no error");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Restaurant.deleteMany({});
  for (let i = 0; i < 100; i++) {
    const randomNum = Math.floor(Math.random() * 400);
    const price =
      Math.ceil(Math.ceil(Math.random() * (2000 + 300)) / 300) * 400;
    const restaurant = new Restaurant({
      author: "630a15fcf83cb706d7214921",
      location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
      geoLocation: `${cities[randomNum].lat},${cities[randomNum].lng}`,
      name: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint tenetur mollitia eaque aliquid, ipsam, sunt ullam libero delectus pariatur, itaque perferendis aspernatur omnis distinctio. Repellat ipsum quae voluptate deserunt. Voluptatibus.",
      images: [...images],
      price: price,
    });
    await restaurant.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});

// Restaurant.insertMany();
