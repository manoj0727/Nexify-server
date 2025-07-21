const Post = require("../models/post.model");
const User = require("../models/user.model");
const Community = require("../models/community.model");
const ModeratorAction = require("../models/moderatorAction.model");
const Announcement = require("../models/announcement.model");

const logModeratorAction = async (moderatorId, action, targetType, targetId, communityId, reason, details = {}) => {
  try {
    const moderatorAction = new ModeratorAction({
      moderator: moderatorId,
      action,
      targetType,
      targetId,
      community: communityId,
      reason,
      details
    });
    await moderatorAction.save();
  } catch (error) {
    console.error("Failed to log moderator action:", error);
  }
};

const pinPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.isPinned = true;
    post.pinnedBy = moderatorId;
    post.pinnedAt = new Date();
    await post.save();

    await logModeratorAction(moderatorId, "pin_post", "post", postId, post.community, "Post pinned");

    res.json({ message: "Post pinned successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unpinPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.isPinned = false;
    post.pinnedBy = null;
    post.pinnedAt = null;
    await post.save();

    await logModeratorAction(moderatorId, "unpin_post", "post", postId, post.community, "Post unpinned");

    res.json({ message: "Post unpinned successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lockPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.isLocked = true;
    post.lockedBy = moderatorId;
    post.lockedAt = new Date();
    if (reason) post.moderatorNotes = reason;
    await post.save();

    await logModeratorAction(moderatorId, "lock_post", "post", postId, post.community, reason || "Post locked");

    res.json({ message: "Post locked successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unlockPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.isLocked = false;
    post.lockedBy = null;
    post.lockedAt = null;
    await post.save();

    await logModeratorAction(moderatorId, "unlock_post", "post", postId, post.community, "Post unlocked");

    res.json({ message: "Post unlocked successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editPostTitle = async (req, res) => {
  try {
    const { postId } = req.params;
    const { newTitle } = req.body;
    const moderatorId = req.user._id;

    if (!newTitle || newTitle.trim().length === 0) {
      return res.status(400).json({ error: "New title is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    const originalTitle = post.originalTitle || post.content;
    post.originalTitle = originalTitle;
    post.content = newTitle.trim();
    post.editedBy = moderatorId;
    post.editedAt = new Date();
    await post.save();

    await logModeratorAction(moderatorId, "edit_title", "post", postId, post.community, "Title edited", {
      originalValue: originalTitle,
      newValue: newTitle.trim()
    });

    res.json({ message: "Post title updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approvePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.moderationStatus = "approved";
    await post.save();

    await logModeratorAction(moderatorId, "approve_post", "post", postId, post.community, "Post approved");

    res.json({ message: "Post approved successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;
    const moderatorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const community = await Community.findById(post.community);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    post.moderationStatus = "rejected";
    if (reason) post.moderatorNotes = reason;
    await post.save();

    await logModeratorAction(moderatorId, "reject_post", "post", postId, post.community, reason || "Post rejected");

    res.json({ message: "Post rejected successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const warnUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, severity = "medium" } = req.body;
    const moderatorId = req.user._id;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ error: "Warning reason is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.warnings.push({
      reason: reason.trim(),
      issuedBy: moderatorId,
      severity
    });
    await user.save();

    await logModeratorAction(moderatorId, "warn_user", "user", userId, null, reason);

    res.json({ message: "Warning issued successfully", warnings: user.warnings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const muteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { duration, reason } = req.body;
    const moderatorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const muteExpiresAt = new Date(Date.now() + (duration * 60 * 1000));
    
    user.isMuted = true;
    user.mutedBy = moderatorId;
    user.mutedAt = new Date();
    user.muteExpiresAt = muteExpiresAt;
    await user.save();

    await logModeratorAction(moderatorId, "mute_user", "user", userId, null, reason, { duration });

    res.json({ message: "User muted successfully", muteExpiresAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unmuteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const moderatorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isMuted = false;
    user.mutedBy = null;
    user.mutedAt = null;
    user.muteExpiresAt = null;
    await user.save();

    await logModeratorAction(moderatorId, "unmute_user", "user", userId, null, "User unmuted");

    res.json({ message: "User unmuted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tempBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { duration, reason } = req.body;
    const moderatorId = req.user._id;

    if (!duration || !reason) {
      return res.status(400).json({ error: "Duration and reason are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const banExpiresAt = new Date(Date.now() + (duration * 60 * 60 * 1000));
    
    user.isTempBanned = true;
    user.tempBannedBy = moderatorId;
    user.tempBanExpiresAt = banExpiresAt;
    user.tempBanReason = reason;
    await user.save();

    await logModeratorAction(moderatorId, "temp_ban", "user", userId, null, reason, { duration });

    res.json({ message: "User temporarily banned successfully", banExpiresAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getModerationQueue = async (req, res) => {
  try {
    const { communityId } = req.params;
    const moderatorId = req.user._id;

    const community = await Community.findById(communityId);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to moderate this community" });
    }

    const pendingPosts = await Post.find({
      community: communityId,
      moderationStatus: "pending"
    }).populate("user", "name avatar isVerified role").sort({ createdAt: -1 });

    res.json({ posts: pendingPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getModeratorActions = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const moderatorId = req.user._id;

    const community = await Community.findById(communityId);
    if (!community.moderators.includes(moderatorId)) {
      return res.status(403).json({ error: "Not authorized to view this data" });
    }

    const actions = await ModeratorAction.find({ community: communityId })
      .populate("moderator", "name avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalActions = await ModeratorAction.countDocuments({ community: communityId });

    res.json({
      actions,
      totalPages: Math.ceil(totalActions / limit),
      currentPage: page,
      totalActions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const moderatorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    user.isVerified = true;
    user.verifiedBy = moderatorId;
    await user.save();

    await logModeratorAction(moderatorId, "verify_user", "user", userId, null, "User verified");

    res.json({ message: "User verified successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const unverifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const moderatorId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User is not verified" });
    }

    user.isVerified = false;
    user.verifiedBy = null;
    await user.save();

    await logModeratorAction(moderatorId, "unverify_user", "user", userId, null, "User verification removed");

    res.json({ message: "User verification removed successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  pinPost,
  unpinPost,
  lockPost,
  unlockPost,
  editPostTitle,
  approvePost,
  rejectPost,
  warnUser,
  muteUser,
  unmuteUser,
  tempBanUser,
  getModerationQueue,
  getModeratorActions,
  verifyUser,
  unverifyUser
};