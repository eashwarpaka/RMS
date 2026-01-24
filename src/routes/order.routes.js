const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOpenOrders,
  updateOrderStatus,
  closeOrder,
  getTodayRevenue,
} = require("../controllers/order.controller");

const { verifyToken } = require("../middleware/auth.middleware");
const { allowRoles } = require("../middleware/role.middleware");

router.post("/", verifyToken, allowRoles("cashier", "admin"), createOrder);

router.get("/kitchen", verifyToken, allowRoles("kitchen", "admin"), getOpenOrders);

router.put("/:id/status", verifyToken, allowRoles("kitchen", "admin"), updateOrderStatus);

// ✅ CLOSE BILL ROUTE
router.put("/:id/close", verifyToken, allowRoles("cashier", "admin"), closeOrder);
router.get(
  "/reports/today",
  verifyToken,
  allowRoles("admin"),
  getTodayRevenue
);
module.exports = router;
