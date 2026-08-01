require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Connection failed:");
    console.log(error.message);
  });