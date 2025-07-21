const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const autoModerationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ruleType: {
      type: String,
      enum: ["keyword_filter", "spam_detection", "length_limit", "link_filter", "caps_filter"],
      required: true,
    },
    conditions: {
      keywords: [String],
      minLength: Number,
      maxLength: Number,
      allowedDomains: [String],
      blockedDomains: [String],
      capsThreshold: Number,
      spamThreshold: Number,
    },
    action: {
      type: String,
      enum: ["flag", "auto_remove", "require_approval", "warn_user", "temp_ban"],
      required: true,
    },
    actionDetails: {
      warningMessage: String,
      banDuration: Number,
      notifyModerators: { type: Boolean, default: true },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    triggeredCount: {
      type: Number,
      default: 0,
    },
    lastTriggered: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

autoModerationSchema.index({ community: 1, isActive: 1 });
autoModerationSchema.index({ ruleType: 1 });

module.exports = mongoose.model("AutoModeration", autoModerationSchema);