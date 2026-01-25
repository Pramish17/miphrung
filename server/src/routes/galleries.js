const express = require("express");
const { body, validationResult } = require("express-validator");
const Gallery = require("../models/Gallery");
const auth = require("../middleware/auth");
const upload = require("../utils/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery entry not found" });
    }
    res.json(gallery);
  })
);

router.post(
  "/",
  auth,
  upload.single("image"),
  [body("title").notEmpty().withMessage("Title required")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const gallery = new Gallery({
      title: req.body.title,
      caption: req.body.caption,
      event: req.body.event,
      albumLink: req.body.albumLink,
      image: `/uploads/${req.file.filename}`,
    });

    const saved = await gallery.save();
    res.status(201).json(saved);
  })
);

router.put(
  "/:id",
  auth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const update = {
      title: req.body.title,
      caption: req.body.caption,
      event: req.body.event,
      albumLink: req.body.albumLink,
    };

    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
    }

    const gallery = await Gallery.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery entry not found" });
    }

    res.json(gallery);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery entry not found" });
    }
    res.json({ message: "Gallery entry deleted" });
  })
);


module.exports = router;
