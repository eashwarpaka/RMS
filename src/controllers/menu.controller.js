const pool = require("../config/db");

// ➕ Create menu item (admin only)
exports.createMenuItem = async (req, res) => {
  const { name, price, category_id, stock_qty } = req.body;

  if (!name || !price || !category_id) {
    return res.status(400).json({
      message: "name, price, category_id required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO menu_items (name, price, category_id, stock_qty)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, price, category_id, stock_qty || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📋 Get all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON m.category_id = c.id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
