const router = require("express").Router();

const {
  retrieveLogInfo,
  deleteLogInfo,
  signin,
  updateServicePreference,
  retrieveServicePreference,
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
} = require("../controllers/admin.controller");

const requireAdminAuth = require("../middlewares/auth/adminAuth");
const {
  configLimiter,
  logLimiter,
  signUpSignInLimiter,
} = require("../middlewares/limiter/limiter");

router.post("/signin", signUpSignInLimiter, signin);

router.use(requireAdminAuth);

router.get("/community/:communityId", getCommunity);
router.get("/communities", getCommunities);
router.get("/moderators", getModerators);
router.get("/users", getAllUsers);

router.patch("/add-moderators", addModerator);
router.patch("/remove-moderators", removeModerator);

router.post("/moderators", createModerator);
router.delete("/moderators/:moderatorId", deleteModerator);

router.post("/communities", createCommunity);
router.put("/community/:communityId", updateCommunity);
router.delete("/community/:communityId", deleteCommunity);

router
  .route("/preferences")
  .get(configLimiter, retrieveServicePreference)
  .put(configLimiter, updateServicePreference);
router
  .route("/logs")
  .get(logLimiter, retrieveLogInfo)
  .delete(logLimiter, deleteLogInfo);

module.exports = router;
