const Admin = require("../models/admin.model");

async function initializeDefaultAdmin() {
  // Only initialize admin if credentials are provided
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.log("ℹ Default admin not configured (ADMIN_USERNAME/ADMIN_PASSWORD not set)");
    return;
  }

  const DEFAULT_ADMIN = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  };

  try {
    // Check if default admin already exists
    const existingAdmin = await Admin.findOne({ username: DEFAULT_ADMIN.username });
    
    if (existingAdmin) {
      // Update password in case it changed
      existingAdmin.password = DEFAULT_ADMIN.password;
      await existingAdmin.save();
      console.log("✓ Default admin user updated");
      return;
    }

    // Create new default admin
    const defaultAdmin = new Admin({
      username: DEFAULT_ADMIN.username,
      password: DEFAULT_ADMIN.password
    });

    await defaultAdmin.save();
    console.log("✓ Default admin user created successfully");
    
  } catch (error) {
    console.error("Failed to initialize default admin:", error.message);
  }
}

module.exports = initializeDefaultAdmin;