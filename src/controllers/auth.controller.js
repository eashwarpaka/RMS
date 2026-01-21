const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const user = {
  id: 1,
  email: "admin@rms.com",
  password: bcrypt.hashSync("admin123", 8),
  role: "admin"
};

exports.loginUser = (req, res) => {
  console.log("LOGIN API HIT"); // 👈 debug line
  console.log(req.body);       // 👈 debug line

  const { email, password } = req.body;

  if (email !== user.email) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
};
