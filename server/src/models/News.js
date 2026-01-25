const mongoose = require("mongoose");
const slugify = require("slugify");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    body: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String },
    publishedAt: { type: String },
  },
  { timestamps: true }
);

newsSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("News", newsSchema);
