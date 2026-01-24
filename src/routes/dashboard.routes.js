const express = require("express");
const router = express.Router();

const { getDashboardMetrics } = require("../controllers/dashboard.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.get("/metrics", verifyToken, allowRoles("admin"), getDashboardMetrics);

module.exports = router;
