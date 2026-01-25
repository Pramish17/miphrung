const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    expiresAt: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
