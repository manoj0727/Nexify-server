const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");

const requireAdminAuth = async (req, res, next) => {
  try {
    // Check both lowercase and uppercase Authorization headers
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    const admin = await Admin.findById(decoded.id);

    if (admin) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized - Admin not found" });
    }
  } catch (error) {
    console.error("Admin auth error:", error.message);
    res.status(401).json({ message: "Unauthorized - Token verification failed" });
  }
};

module.exports = requireAdminAuth;
