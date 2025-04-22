const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Make sure this matches the login secret

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 AUTH HEADER:", authHeader); // Debug log

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    console.log("🪙 TOKEN RECEIVED:", token); // Debug log

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Use same secret used during login
      console.log("✅ TOKEN DECODED:", decoded); // Debug log

      req.user = decoded; // Attach user info to request
      next(); // Pass control
    } catch (error) {
      console.error("❌ JWT VERIFY ERROR:", error.message); // Log actual reason
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error("🚫 NO TOKEN PROVIDED");
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = { protect };
