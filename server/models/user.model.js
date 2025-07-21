const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    location: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    interests: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["general", "moderator", "admin"],
      default: "general",
    },

    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    
    // Advanced User Management Fields
    warnings: [
      {
        reason: { type: String, required: true },
        issuedBy: { type: Schema.Types.ObjectId, ref: "User" },
        issuedAt: { type: Date, default: Date.now },
        severity: { type: String, enum: ["low", "medium", "high"], default: "medium" }
      }
    ],
    isMuted: {
      type: Boolean,
      default: false,
    },
    mutedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mutedAt: {
      type: Date,
    },
    muteExpiresAt: {
      type: Date,
    },
    isTempBanned: {
      type: Boolean,
      default: false,
    },
    tempBannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tempBanExpiresAt: {
      type: Date,
    },
    tempBanReason: {
      type: String,
    },
    
    // Special Privileges
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hasPriority: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ name: "text" });
module.exports = mongoose.model("User", userSchema);
