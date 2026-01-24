require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const categoryRoutes = require("./routes/category.routes");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const dashboardRoutes = require("./routes/dashboard.routes");


app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("RMS Backend is running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
