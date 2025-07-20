require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Demo user configuration
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@nexify.com',
  password: 'demo123',
  bio: 'This is a demo account for exploring Nexify features',
  location: 'Demo Land',
  interests: 'Technology, Social Media, Demo',
  isEmailVerified: true,
  role: 'general'
};

async function createDemoUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: DEMO_USER.email });
    if (existingUser) {
      console.log('Demo user already exists!');
      
      // Update the password in case it was changed
      const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);
      existingUser.password = hashedPassword;
      existingUser.isEmailVerified = true;
      await existingUser.save();
      
      console.log('Demo user password updated successfully');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, 10);

    // Create the demo user
    const demoUser = new User({
      ...DEMO_USER,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=Demo+User&background=008cff&color=fff&size=128`
    });

    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log('Email:', DEMO_USER.email);
    console.log('Password:', DEMO_USER.password);
    console.log('Status: Email verified ✓');

  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the script
createDemoUser();