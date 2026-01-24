require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => {
  res.send("RMS Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
