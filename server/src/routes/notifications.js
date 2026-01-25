const express = require("express");
const { body, validationResult } = require("express-validator");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  })
);

router.post(
  "/",
  auth,
  [
    body("title").notEmpty().withMessage("Title required"),
    body("message").notEmpty().withMessage("Message required"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const notification = new Notification({
      title: req.body.title,
      message: req.body.message,
      priority: req.body.priority || "normal",
      expiresAt: req.body.expiresAt,
    });

    const saved = await notification.save();
    res.status(201).json(saved);
  })
);

router.put(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        message: req.body.message,
        priority: req.body.priority,
        expiresAt: req.body.expiresAt,
      },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  })
);

router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  })
);

module.exports = router;
