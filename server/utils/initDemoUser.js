const bcrypt = require("bcrypt");
const User = require("../models/user.model");

async function initializeDemoUser() {
  // Only initialize demo user if credentials are provided
  if (!process.env.DEMO_EMAIL || !process.env.DEMO_PASSWORD) {
    console.log("ℹ Demo user not configured (DEMO_EMAIL/DEMO_PASSWORD not set)");
    return;
  }

  const DEMO_USER = {
    name: process.env.DEMO_NAME || "Demo User",
    email: process.env.DEMO_EMAIL,
    password: process.env.DEMO_PASSWORD,
    bio: "This is a demo account for exploring Nexify features",
    location: "Demo Land",
    interests: "Technology, Social Media, Demo",
    isEmailVerified: true,
    role: "general"
  };

  try {
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: DEMO_USER.email });
    
    if (existingUser) {
      // Update password in case it changed
      const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
      existingUser.password = hashedPassword;
      existingUser.isEmailVerified = true;
      await existingUser.save();
      console.log("✓ Demo user updated");
      return;
    }

    // Create new demo user
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
    const demoUser = new User({
      ...DEMO_USER,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(DEMO_USER.name)}&background=008cff&color=fff&size=128`
    });

    await demoUser.save();
    console.log("✓ Demo user created successfully");
    
  } catch (error) {
    console.error("Failed to initialize demo user:", error.message);
  }
}

module.exports = initializeDemoUser;