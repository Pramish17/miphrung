const mongoose = require("mongoose");

const executiveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    termStart: { type: String, required: true },
    termEnd: { type: String },
    type: { type: String, enum: ["current", "past"], default: "current" },
    bio: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Executive", executiveSchema);
