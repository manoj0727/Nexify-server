const express = require("express");
const passport = require("passport");
const router = express.Router();
const {
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
} = require("../controllers/moderator.controller");

const requireAuth = passport.authenticate("jwt", { session: false }, null);

// Post Moderation Routes
router.post("/posts/:postId/pin", requireAuth, pinPost);
router.delete("/posts/:postId/pin", requireAuth, unpinPost);
router.post("/posts/:postId/lock", requireAuth, lockPost);
router.delete("/posts/:postId/lock", requireAuth, unlockPost);
router.patch("/posts/:postId/title", requireAuth, editPostTitle);
router.patch("/posts/:postId/approve", requireAuth, approvePost);
router.patch("/posts/:postId/reject", requireAuth, rejectPost);

// User Moderation Routes
router.post("/users/:userId/warn", requireAuth, warnUser);
router.post("/users/:userId/mute", requireAuth, muteUser);
router.delete("/users/:userId/mute", requireAuth, unmuteUser);
router.post("/users/:userId/tempban", requireAuth, tempBanUser);
router.post("/users/:userId/verify", requireAuth, verifyUser);
router.delete("/users/:userId/verify", requireAuth, unverifyUser);

// Moderation Queue & Analytics
router.get("/community/:communityId/queue", requireAuth, getModerationQueue);
router.get("/community/:communityId/actions", requireAuth, getModeratorActions);

module.exports = router;