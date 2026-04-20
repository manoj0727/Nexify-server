const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

relationshipSchema.index({ follower: 1, following: 1 }, { unique: true });
relationshipSchema.index({ following: 1 });

module.exports = mongoose.model("Relationship", relationshipSchema);
