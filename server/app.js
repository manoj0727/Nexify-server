require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const express = require("express");
const compression = require("compression");
const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const moderatorRoutes = require("./routes/moderator.routes");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");
const {
  validateEnvironment,
  getCorsOptions,
  isProduction,
} = require("./config/deployment");

const app = express();

const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const PORT = process.env.PORT || 4000;

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

// trust proxy so req.ip works correctly behind Render / load balancers
app.set("trust proxy", 1);
app.disable("x-powered-by");

// gzip/brotli fallback — biggest single per-request win for JSON payloads
app.use(
  compression({
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

app.use(cors(getCorsOptions()));
app.use(morgan(isProduction() ? "combined" : "dev"));

// long-lived caching for user-uploaded assets (URL contains content hash in practice)
const STATIC_CACHE = { maxAge: "30d", immutable: true, etag: true };
app.use(
  "/assets/userFiles",
  express.static(__dirname + "/assets/userFiles", STATIC_CACHE)
);
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars", STATIC_CACHE)
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(passport.initialize());
require("./config/passport.js");

// lightweight liveness endpoint — used by uptime pingers to keep dynos warm
app.get(["/server-status", "/health", "/ping"], (req, res) => {
  res.status(200).json({ ok: true, uptime: process.uptime() });
});

app.get("/search", decodeToken, search);

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

async function start() {
  try {
    await db.connect();
    console.log("Database connection established successfully");

    const initDemoUser = require("./utils/initDemoUser");
    await initDemoUser();

    const initDefaultAdmin = require("./utils/initDefaultAdmin");
    await initDefaultAdmin();

    const initCommunities = require("./utils/initCommunities");
    await initCommunities();

    app.listen(PORT, () => {
      console.log(`Server up and running on port ${PORT}!`);
      if (isProduction()) {
        console.log("🚀 Running in production mode");
      }
    });
  } catch (err) {
    console.error("Fatal startup error:", err.message);
    console.error("Please check your MONGODB_URI and Atlas cluster status.");
    process.exit(1);
  }
}

start();
