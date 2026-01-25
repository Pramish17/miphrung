const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    publishedAt: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
