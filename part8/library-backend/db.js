require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });