const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan("dev"));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kongu_community";

const { initBackupScheduler } = require('./utils/backup');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB 🍃");
    initBackupScheduler(); // Start Automatic Backups
  })
  .catch(err => {
    console.error("CRITICAL: MongoDB connection error:", err.message);
    console.log("Using Mock Database Logic... (Internal Server Error will occur on DB writes)");
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Kongu Community API running 🚀", version: "1.0.0" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/upload", require("./routes/upload"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

module.exports = app;
