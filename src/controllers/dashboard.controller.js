const pool = require("../config/db");

exports.getDashboardMetrics = async (req, res) => {
  try {
    const openOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE status != 'CLOSED'"
    );

    const revenueToday = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0)
       FROM orders
       WHERE status = 'CLOSED'
         AND DATE(closed_at) = CURRENT_DATE`
    );

    const ordersToday = await pool.query(
      `SELECT COUNT(*)
       FROM orders
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    const topItem = await pool.query(
      `SELECT m.name, SUM(oi.qty) AS total_qty
       FROM order_items oi
       JOIN menu_items m ON oi.menu_item_id = m.id
       JOIN orders o ON oi.order_id = o.id
       WHERE DATE(o.created_at) = CURRENT_DATE
       GROUP BY m.name
       ORDER BY total_qty DESC
       LIMIT 1`
    );

    res.json({
      open_orders: Number(openOrders.rows[0].count),
      revenue_today: revenueToday.rows[0].coalesce || 0,
      orders_today: Number(ordersToday.rows[0].count),
      top_item: topItem.rows[0]?.name || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
