const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
    },

    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    bannedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    rules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rule",
        default: [],
      },
    ],
    
    // Community Customization & Moderation Features
    customRules: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    moderationSettings: {
      requireApproval: { type: Boolean, default: false },
      autoModeration: { type: Boolean, default: false },
      allowLinks: { type: Boolean, default: true },
      minPostLength: { type: Number, default: 0 },
      maxPostLength: { type: Number, default: 10000 },
      slowMode: { type: Number, default: 0 }
    },
    analytics: {
      totalPosts: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 },
      activeMembers: { type: Number, default: 0 },
      moderatorActions: { type: Number, default: 0 }
    },
  },

  {
    timestamps: true,
  }
);

communitySchema.index({ name: "text" });

module.exports = mongoose.model("Community", communitySchema);
