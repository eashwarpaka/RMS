require("dotenv").config();

const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB ERROR:", err);
  } else {
    console.log("DB Connected at:", res.rows[0]);
  }
  process.exit();
});
