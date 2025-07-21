const Log = require("../models/log.model");
const dayjs = require("dayjs");
const formatCreatedAt = require("../utils/timeConverter");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AdminToken = require("../models/token.admin.model");
const Config = require("../models/config.model");
const Community = require("../models/community.model");
const User = require("../models/user.model");

/**
 * @route GET /admin/logs
 */
const retrieveLogInfo = async (req, res) => {
  try {
    // Only sign in logs contain encrypted context data & email
    const [signInLogs, generalLogs] = await Promise.all([
      Log.find({ type: "sign in" }).sort({ createdAt: -1 }).limit(50),

      Log.find({ type: { $ne: "sign in" } })
        .sort({ createdAt: -1 })
        .limit(50),
    ]);

    const formattedSignInLogs = [];
    for (let i = 0; i < signInLogs.length; i++) {
      const { _id, email, context, message, type, level, timestamp } =
        signInLogs[i];
      const contextData = context.split(",");
      const formattedContext = {};

      for (let j = 0; j < contextData.length; j++) {
        const [key, value] = contextData[j].split(":");
        if (key === "IP") {
          formattedContext["IP Address"] = contextData[j]
            .split(":")
            .slice(1)
            .join(":");
        } else {
          formattedContext[key.trim()] = value.trim();
        }
      }

      formattedSignInLogs.push({
        _id,
        email,
        contextData: formattedContext,
        message,
        type,
        level,
        timestamp,
      });
    }
    const formattedGeneralLogs = generalLogs.map((log) => ({
      _id: log._id,
      email: log.email,
      message: log.message,
      type: log.type,
      level: log.level,
      timestamp: log.timestamp,
    }));

    const formattedLogs = [...formattedSignInLogs, ...formattedGeneralLogs]
      .map((log) => ({
        ...log,
        formattedTimestamp: formatCreatedAt(log.timestamp),
        relativeTimestamp: dayjs(log.timestamp).fromNow(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json(formattedLogs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @route DELETE /admin/logs
 */
const deleteLogInfo = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.status(200).json({ message: "All logs deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @route POST /admin/signin
 */
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Admin.findOne({
      username,
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    const newAdminToken = new AdminToken({
      user: existingUser._id,
      accessToken,
    });

    await newAdminToken.save();

    res.status(200).json({
      accessToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @route GET /admin/preferences
 */
const retrieveServicePreference = async (req, res) => {
  try {
    const config = await Config.findOne({});

    if (!config) {
      const newConfig = new Config();
      await newConfig.save();
      return res.status(200).json(newConfig);
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving system preferences" });
  }
};

/**
 * @route PUT /admin/preferences
 */
const updateServicePreference = async (req, res) => {
  try {
    const {
      usePerspectiveAPI,
      categoryFilteringServiceProvider,
      categoryFilteringRequestTimeout,
    } = req.body;

    const config = await Config.findOneAndUpdate(
      {},
      {
        usePerspectiveAPI,
        categoryFilteringServiceProvider,
        categoryFilteringRequestTimeout,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error updating system preferences" });
  }
};

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}).select("_id name banner");
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId)
      .select("_id name description banner moderators members")
      .populate("moderators", "_id name")
      .lean();

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const moderatorCount = community.moderators.length;
    const memberCount = community.members.length;
    const formattedCommunity = {
      ...community,
      memberCount,
      moderatorCount,
    };
    res.status(200).json(formattedCommunity);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving community" });
  }
};

const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" }).select(
      "_id name email"
    );
    res.status(200).json(moderators);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving moderators" });
  }
};

const createCommunity = async (req, res) => {
  try {
    const { name, description, banner } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community with this name already exists" });
    }

    const newCommunity = new Community({
      name,
      description,
      banner: banner || "",
    });

    await newCommunity.save();
    res.status(201).json({ message: "Community created successfully", community: newCommunity });
  } catch (error) {
    res.status(500).json({ message: "Error creating community" });
  }
};

const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { name, description, banner } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (name && name !== community.name) {
      const existingCommunity = await Community.findOne({ name });
      if (existingCommunity) {
        return res.status(400).json({ message: "Community with this name already exists" });
      }
      community.name = name;
    }

    if (description) community.description = description;
    if (banner !== undefined) community.banner = banner;

    await community.save();
    res.status(200).json({ message: "Community updated successfully", community });
  } catch (error) {
    res.status(500).json({ message: "Error updating community" });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    await Community.findByIdAndDelete(communityId);
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting community" });
  }
};

const createModerator = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, username and password are required" });
    }

    // Create special moderator email with @nexify.mod domain
    const email = `${username}@nexify.mod`;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Moderator with this username already exists" });
    }

    // Hash password
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create moderator user directly (no email verification needed)
    const newModerator = new User({
      name,
      email,
      password: hashedPassword,
      role: "moderator",
      avatar: "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg",
      isEmailVerified: true, // Skip email verification for admin-created moderators
    });

    await newModerator.save();
    
    res.status(201).json({ 
      message: "Moderator created successfully", 
      moderator: {
        _id: newModerator._id,
        name: newModerator.name,
        email: newModerator.email,
        role: newModerator.role
      }
    });
  } catch (error) {
    console.error("Error creating moderator:", error);
    res.status(500).json({ message: "Error creating moderator" });
  }
};

const deleteModerator = async (req, res) => {
  try {
    const { moderatorId } = req.params;

    // Find the moderator
    const moderator = await User.findById(moderatorId);
    if (!moderator) {
      return res.status(404).json({ message: "Moderator not found" });
    }

    if (moderator.role !== "moderator") {
      return res.status(400).json({ message: "User is not a moderator" });
    }

    // Remove moderator from all communities first
    await Community.updateMany(
      { moderators: moderatorId },
      { $pull: { moderators: moderatorId, members: moderatorId } }
    );

    // Delete the moderator user
    await User.findByIdAndDelete(moderatorId);
    
    res.status(200).json({ message: "Moderator removed successfully" });
  } catch (error) {
    console.error("Error removing moderator:", error);
    res.status(500).json({ message: "Error removing moderator" });
  }
};
const addModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (existingModerator) {
      return res.status(400).json({ message: "Already a moderator" });
    }
    community.moderators.push(moderatorId);
    community.members.push(moderatorId);
    await community.save();
    res.status(200).json({ message: "Moderator added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding moderator" });
  }
};

const removeModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (!existingModerator) {
      return res.status(400).json({ message: "Not a moderator" });
    }
    community.moderators = community.moderators.filter(
      (mod) => mod.toString() !== moderatorId
    );
    community.members = community.members.filter(
      (mod) => mod.toString() !== moderatorId
    );

    await community.save();
    res.status(200).json({ message: "Moderator removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing moderator" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email avatar role isVerified verifiedBy createdAt warnings isMuted isTempBanned")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = {
  retrieveServicePreference,
  updateServicePreference,
  retrieveLogInfo,
  deleteLogInfo,
  signin,
  getCommunities,
  getCommunity,
  addModerator,
  removeModerator,
  getModerators,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  createModerator,
  deleteModerator,
  getAllUsers,
};

// Verify a user
const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ 
      message: "User verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Error verifying user" });
  }
};

// Unverify a user
const unverifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = false;
    await user.save();

    res.status(200).json({ 
      message: "User verification removed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Error removing user verification:", error);
    res.status(500).json({ message: "Error removing user verification" });
  }
};

module.exports.verifyUser = verifyUser;
module.exports.unverifyUser = unverifyUser;
