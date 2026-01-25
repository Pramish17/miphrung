const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const executiveRoutes = require("./routes/executives");
const announcementRoutes = require("./routes/announcements");
const newsRoutes = require("./routes/news");
const notificationRoutes = require("./routes/notifications");
const galleryRoutes = require("./routes/galleries");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static(path.join(__dirname, "..", "..", "client")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/executives", executiveRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/galleries", galleryRoutes);

app.use(errorHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "client", "index.html"));
});

const start = async () => {
  const port = process.env.PORT || 5000;
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
