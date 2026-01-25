const express = require("express");
const { body, validationResult } = require("express-validator");
const Announcement = require("../models/Announcement");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json(announcement);
  })
);

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("body").notEmpty().withMessage("Body required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const announcement = new Announcement({
      title: req.body.title,
      body: req.body.body,
      publishedAt: req.body.publishedAt,
    });

    const saved = await announcement.save();
    res.status(201).json(saved);
  })
);

router.put(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        body: req.body.body,
        publishedAt: req.body.publishedAt,
      },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.json({ message: "Announcement deleted" });
  })
);

module.exports = router;
