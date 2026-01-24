const express = require("express");
const router = express.Router();

const {
  createMenuItem,
  getMenuItems
} = require("../controllers/menu.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post("/", verifyToken, allowRoles("admin"), createMenuItem);
router.get("/", verifyToken, getMenuItems);

module.exports = router;
