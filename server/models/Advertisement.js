const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema(
  {
    title: String,
    videoUrl: String,
    brand: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", AdvertisementSchema);