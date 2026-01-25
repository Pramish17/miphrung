const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Event = require("../models/Event");
const Executive = require("../models/Executive");
const Announcement = require("../models/Announcement");
const News = require("../models/News");
const Notification = require("../models/Notification");
const Gallery = require("../models/Gallery");

dotenv.config();

const seed = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@miphrung.org";
  const password = process.env.ADMIN_PASSWORD || "Miphrung@123";
  const name = process.env.ADMIN_NAME || "Miphrung Admin";
  const placeholders = [
    "/assets/placeholder-1.svg",
    "/assets/placeholder-2.svg",
    "/assets/placeholder-3.svg",
    "/assets/cover.jpg",
  ];

  let admin = await User.findOne({ email });
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await User.create({
      name,
      email,
      role: "admin",
      passwordHash,
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  const existingEvents = await Event.countDocuments();
  if (existingEvents === 0) {
    await Event.create({
      title: "Community Clean-Up Drive",
      date: "2026-02-12",
      time: "08:30",
      location: "Miphrung Community Hall",
      category: "Service",
      description:
        "Join us for a morning of community service and neighborhood clean-up led by youth volunteers.",
      status: "upcoming",
      coverImage: placeholders[1],
    });

    await Event.create({
      title: "Leadership Workshop",
      date: "2026-03-05",
      time: "10:00",
      location: "Youth Club Conference Room",
      category: "Training",
      description:
        "Interactive leadership and public speaking workshop for the 2026 youth cohort.",
      status: "upcoming",
      coverImage: placeholders[2],
    });
  }

  const existingExecutives = await Executive.countDocuments();
  if (existingExecutives === 0) {
    await Executive.create({
      name: "Lianthang Kipgen",
      role: "President",
      termStart: "2025",
      type: "current",
      bio: "Focused on community-led initiatives and youth mentorship.",
      photo: placeholders[2],
    });

    await Executive.create({
      name: "Hena Chongloi",
      role: "Secretary",
      termStart: "2025",
      type: "current",
      bio: "Coordinates outreach programs and communications.",
      photo: placeholders[2],
    });

    await Executive.create({
      name: "Joram Haokip",
      role: "Former Treasurer",
      termStart: "2023",
      termEnd: "2024",
      type: "past",
      bio: "Oversaw funding partnerships and budgeting.",
      photo: placeholders[3],
    });
  }

  const existingAnnouncements = await Announcement.countDocuments();
  if (existingAnnouncements === 0) {
    await Announcement.create({
      title: "Annual Membership Renewal",
      body: "Membership renewal opens on Feb 1. Submit forms at the community desk.",
      publishedAt: "2026-01-25",
    });
  }

  const existingNews = await News.countDocuments();
  if (existingNews === 0) {
    await News.create({
      title: "Youth Club Launches Digital Literacy Camp",
      body: "The Miphrung Youth Club has launched a six-week digital literacy program to support students preparing for higher education and modern workplaces.",
      author: "Editorial Desk",
      publishedAt: "2026-01-20",
      coverImage: placeholders[3],
    });
  }

  const existingNotifications = await Notification.countDocuments();
  if (existingNotifications === 0) {
    await Notification.create({
      title: "Meeting Reminder",
      message: "Executive meeting scheduled for Friday at 5 PM in the community hall.",
      priority: "high",
      expiresAt: "2026-01-30",
    });
  }

  const existingGalleries = await Gallery.countDocuments();
  if (existingGalleries === 0) {
    await Gallery.create([
      {
        title: "Youth Day 2025",
        caption: "Highlights from last year's cultural performances.",
        image: placeholders[0],
        albumLink: "https://drive.google.com/",
      },
      {
        title: "Leadership Workshop",
        caption: "Snapshots from our public speaking sessions.",
        image: placeholders[2],
        albumLink: "https://drive.google.com/",
      },
    ]);
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
