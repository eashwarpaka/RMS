const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories
} = require("../controllers/category.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post("/", verifyToken, allowRoles("admin"), createCategory);
router.get("/", verifyToken, getCategories);

module.exports = router;
