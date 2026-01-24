const pool = require("../config/db");

// 🧾 Create new order
exports.createOrder = async (req, res) => {
  const { table_no, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Order items required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create order
    const orderRes = await client.query(
      "INSERT INTO orders (table_no, status) VALUES ($1, $2) RETURNING *",
      [table_no || null, "OPEN"]
    );

    const orderId = orderRes.rows[0].id;
    let total = 0;

    for (const item of items) {
      const menuRes = await client.query(
        "SELECT price, stock_qty FROM menu_items WHERE id = $1",
        [item.menu_item_id]
      );

      if (menuRes.rows.length === 0) {
        throw new Error("Menu item not found");
      }

      const menu = menuRes.rows[0];

      if (menu.stock_qty < item.qty) {
        throw new Error("Not enough stock");
      }

      const price = menu.price * item.qty;
      total += price;

      // Insert order item
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, qty, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.menu_item_id, item.qty, price]
      );

      // Deduct stock
      await client.query(
        "UPDATE menu_items SET stock_qty = stock_qty - $1 WHERE id = $2",
        [item.qty, item.menu_item_id]
      );
    }

    // Update order total
    await client.query(
      "UPDATE orders SET total_amount = $1 WHERE id = $2",
      [total, orderId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order created",
      order_id: orderId,
      total
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(400).json({ message: err.message });

  } finally {
    client.release();
  }
};
// 🍳 Kitchen view - open orders
exports.getOpenOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders
       WHERE status IN ('OPEN', 'COOKING')
       ORDER BY created_at ASC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowed = ["COOKING", "READY", "SERVED", "CLOSED"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.closeOrder = async (req, res) => {
  const { payment_method } = req.body;
  const { id } = req.params;

  if (!payment_method) {
    return res.status(400).json({ message: "Payment method required" });
  }

  try {
    await pool.query(
      `UPDATE orders
       SET status = 'CLOSED',
           payment_method = $1,
           closed_at = NOW()
       WHERE id = $2`,
      [payment_method, id]
    );

    res.json({ message: "Order closed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// 📊 Revenue today
exports.getTodayRevenue = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       WHERE status = 'CLOSED'
         AND DATE(closed_at) = CURRENT_DATE`
    );

    res.json({ revenue: result.rows[0].revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
