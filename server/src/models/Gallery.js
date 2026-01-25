const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    event: { type: String },
    image: { type: String, required: true },
    caption: { type: String },
    albumLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
