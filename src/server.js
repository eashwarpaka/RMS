// Import express library
const express = require("express");

// Create an express app
const app = express();

// Middleware to read JSON data
app.use(express.json());

// Test route (API)
app.get("/", (req, res) => {
  res.send("RMS Backend is running");
});

// Start server on port 5000
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
