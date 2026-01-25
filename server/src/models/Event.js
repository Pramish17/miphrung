const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String, required: true },
    category: { type: String },
    description: { type: String, required: true },
    coverImage: { type: String },
    status: { type: String, default: "upcoming" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
