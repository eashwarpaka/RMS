const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

// Protected API
router.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to protected dashboard",
    user: req.user
  });
});

module.exports = router;
