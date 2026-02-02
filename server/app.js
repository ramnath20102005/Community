const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB 🍃"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    console.log("Proceeding with mock DB logic for demo safety...");
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
