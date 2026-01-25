const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event");
const auth = require("../middleware/auth");
const upload = require("../utils/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  })
);

router.post(
  "/",
  auth,
  upload.single("coverImage"),
  [
    body("title").notEmpty().withMessage("Title required"),
    body("date").notEmpty().withMessage("Date required"),
    body("location").notEmpty().withMessage("Location required"),
    body("description").notEmpty().withMessage("Description required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event({
      title: req.body.title,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
      status: req.body.status || "upcoming",
      coverImage: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const saved = await event.save();
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
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
      status: req.body.status,
    };

    if (req.file) {
      update.coverImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted" });
  })
);

module.exports = router;
