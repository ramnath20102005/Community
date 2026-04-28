const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware - CORS configuration for EC2 deployment
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://13.60.163.36:3000',
    'http://13.60.163.36',
    'http://16.170.245.52:3000',
    'http://16.170.245.52',
    'http://13.61.9.193:3000',
    'http://13.61.9.193',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(morgan("combined")); // Use combined for detailed logging

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kongu_community";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB 🍃"))
  .catch(err => {
    console.error("CRITICAL: MongoDB connection error:", err.message);
    console.log("Using Mock Database Logic... (Internal Server Error will occur on DB writes)");
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Kongu Community API running 🚀", version: "1.0.0" });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/upload", require("./routes/upload"));

// Global Error Handler - Recovery Strategy
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log full error for developers
  console.error(`[🔥 Server Error] ${req.method} ${req.path}:`, err.stack);

  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err : {},
    recovery: "If this persists, please try refreshing the platform."
  });
});

module.exports = app;
