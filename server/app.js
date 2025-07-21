require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const moderatorRoutes = require("./routes/moderator.routes");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");
const { validateEnvironment, getCorsOptions, isProduction } = require("./config/deployment");

const app = express();

const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const PORT = process.env.PORT || 4000;

// Validate environment variables on startup
try {
  validateEnvironment();
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  if (isProduction()) {
    process.exit(1);
  }
}

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to database before setting up routes
db.connect()
  .then(async () => {
    console.log("Database connection established successfully");
    
    // Initialize demo user
    const initDemoUser = require("./utils/initDemoUser");
    await initDemoUser();
    
    // Initialize default admin
    const initDefaultAdmin = require("./utils/initDefaultAdmin");
    await initDefaultAdmin();
    
    // Initialize default communities
    const initCommunities = require("./utils/initCommunities");
    await initCommunities();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
    console.error("Please check your MONGODB_URI in .env file");
    process.exit(1);
  });

app.use(cors(getCorsOptions()));
app.use(morgan(isProduction() ? "combined" : "dev"));
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.get("/search", decodeToken, search);

// Temporary test endpoint to check users (remove in production)
app.get("/test-users", async (req, res) => {
  const User = require("./models/user.model");
  try {
    const users = await User.find({}).select("name email role isVerified").limit(5);
    const count = await User.countDocuments();
    res.json({ count, users });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Temporary endpoint to verify a user manually (remove in production)
app.post("/test-verify/:userId", async (req, res) => {
  const User = require("./models/user.model");
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.isVerified = true;
    await user.save();
    
    res.json({ 
      message: "User verified successfully", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Temporary endpoint to unverify a user manually (remove in production)
app.post("/test-unverify/:userId", async (req, res) => {
  const User = require("./models/user.model");
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.isVerified = false;
    await user.save();
    
    res.json({ 
      message: "User unverified successfully", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Test endpoint to check post user data (remove in production)
app.get("/test-post-data", async (req, res) => {
  const Post = require("./models/post.model");
  try {
    const posts = await Post.find({})
      .populate("user", "name avatar isVerified role")
      .populate("community", "name")
      .limit(3)
      .sort({ createdAt: -1 });
    
    res.json({ 
      message: "Sample post data with user info",
      posts: posts.map(p => ({
        _id: p._id,
        content: p.content?.substring(0, 50) + "...",
        user: p.user,
        community: p.community,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Temporary endpoint to enable context-based auth for a user (remove in production)
app.post("/test-enable-context/:userId", async (req, res) => {
  const UserPreference = require("./models/preference.model");
  const UserContext = require("./models/context.model");
  try {
    let userPreferences = await UserPreference.findOne({ user: req.params.userId });
    
    if (!userPreferences) {
      userPreferences = new UserPreference({
        user: req.params.userId,
        enableContextBasedAuth: true
      });
    } else {
      userPreferences.enableContextBasedAuth = true;
    }
    
    await userPreferences.save();
    
    // Create sample context data if none exists
    const existingContext = await UserContext.findOne({ user: req.params.userId });
    if (!existingContext) {
      const contextData = new UserContext({
        user: req.params.userId,
        ip: "127.0.0.1",
        country: "US",
        city: "Local",
        browser: "Chrome 120",
        platform: "Mac",
        os: "macOS",
        device: "Desktop",
        deviceType: "Desktop",
        isTrusted: true,
        isBlocked: false
      });
      await contextData.save();
    }
    
    res.json({ 
      message: "Context-based authentication enabled successfully",
      preferences: userPreferences
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);
app.use("/moderator", moderatorRoutes);

process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}!`);
  if (isProduction()) {
    console.log("🚀 Running in production mode");
  }
});
