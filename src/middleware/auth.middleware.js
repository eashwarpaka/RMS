const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  // MUST be "Bearer TOKEN"
  const parts = authHeader.split(" ");
  const token = parts[1];

  console.log("TOKEN:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT ERROR:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("DECODED:", decoded);
    req.user = decoded;
    next();
  });
};
