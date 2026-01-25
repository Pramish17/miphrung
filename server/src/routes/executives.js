const express = require("express");
const { body, validationResult } = require("express-validator");
const Executive = require("../models/Executive");
const auth = require("../middleware/auth");
const upload = require("../utils/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const executives = await Executive.find().sort({ createdAt: -1 });
    res.json(executives);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const executive = await Executive.findById(req.params.id);
    if (!executive) {
      return res.status(404).json({ message: "Executive not found" });
    }
    res.json(executive);
  })
);

router.post(
  "/",
  auth,
  upload.single("photo"),
  [
    body("name").notEmpty().withMessage("Name required"),
    body("role").notEmpty().withMessage("Role required"),
    body("termStart").notEmpty().withMessage("Term start required"),
    body("type").isIn(["current", "past"]).withMessage("Type required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const executive = new Executive({
      name: req.body.name,
      role: req.body.role,
      termStart: req.body.termStart,
      termEnd: req.body.termEnd,
      type: req.body.type || "current",
      bio: req.body.bio,
      photo: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const saved = await executive.save();
    res.status(201).json(saved);
  })
);

router.put(
  "/:id",
  auth,
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    const update = {
      name: req.body.name,
      role: req.body.role,
      termStart: req.body.termStart,
      termEnd: req.body.termEnd,
      type: req.body.type,
      bio: req.body.bio,
    };

    if (req.file) {
      update.photo = `/uploads/${req.file.filename}`;
    }

    const executive = await Executive.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!executive) {
      return res.status(404).json({ message: "Executive not found" });
    }

    res.json(executive);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const executive = await Executive.findByIdAndDelete(req.params.id);
    if (!executive) {
      return res.status(404).json({ message: "Executive not found" });
    }
    res.json({ message: "Executive deleted" });
  })
);

module.exports = router;
