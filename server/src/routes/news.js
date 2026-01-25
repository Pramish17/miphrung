const express = require("express");
const { body, validationResult } = require("express-validator");
const News = require("../models/News");
const auth = require("../middleware/auth");
const upload = require("../utils/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const story = await News.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.json(story);
  })
);

router.post(
  "/",
  auth,
  upload.single("coverImage"),
  [
    body("title").notEmpty().withMessage("Title required"),
    body("body").notEmpty().withMessage("Body required"),
    body("author").notEmpty().withMessage("Author required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const story = new News({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
      publishedAt: req.body.publishedAt,
      coverImage: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const saved = await story.save();
    res.status(201).json(saved);
  })
);

router.put(
  "/:id",
  auth,
  upload.single("coverImage"),
  asyncHandler(async (req, res) => {
    const update = {
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
      publishedAt: req.body.publishedAt,
    };

    if (req.file) {
      update.coverImage = `/uploads/${req.file.filename}`;
    }

    const story = await News.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!story) {
      return res.status(404).json({ message: "News article not found" });
    }

    res.json(story);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const story = await News.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.json({ message: "News article deleted" });
  })
);

module.exports = router;
