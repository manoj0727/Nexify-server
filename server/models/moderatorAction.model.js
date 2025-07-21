const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const moderatorActionSchema = new Schema(
  {
    moderator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "pin_post",
        "unpin_post", 
        "lock_post",
        "unlock_post",
        "edit_title",
        "warn_user",
        "mute_user",
        "unmute_user",
        "temp_ban",
        "unban_user",
        "verify_user",
        "unverify_user",
        "delete_post",
        "approve_post",
        "reject_post"
      ],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["post", "user", "comment"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    reason: {
      type: String,
    },
    details: {
      originalValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
    },
    duration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

moderatorActionSchema.index({ moderator: 1, createdAt: -1 });
moderatorActionSchema.index({ community: 1, createdAt: -1 });
moderatorActionSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("ModeratorAction", moderatorActionSchema);