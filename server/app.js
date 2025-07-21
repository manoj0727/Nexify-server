require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
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

app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);

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
