// Import express library
const express = require("express");
const app = express();

app.use(express.json());

// 👇 THIS LINE IS REQUIRED
const authRoutes = require("./routes/auth.routes");

// 👇 THIS LINE IS REQUIRED
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("RMS Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
