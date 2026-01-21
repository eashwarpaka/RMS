const express = require("express");
const router = express.Router();

// Import controller
const { loginUser } = require("../controllers/auth.controller");

// Login API
router.post("/login", loginUser);

module.exports = router;
