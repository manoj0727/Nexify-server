const Community = require("../models/community.model");
const communities = require("../data/communities.json");

const initCommunities = async () => {
  try {
    // Check if communities already exist
    const existingCommunities = await Community.find({}, { name: 1 });
    const existingCommunityNames = existingCommunities.map((c) => c.name);

    // Filter out communities that already exist
    const newCommunities = communities.filter(
      (community) => !existingCommunityNames.includes(community.name)
    );

    if (newCommunities.length > 0) {
      // Insert new communities
      await Community.insertMany(newCommunities);
      console.log(`✅ Initialized ${newCommunities.length} default communities`);
    }
  } catch (error) {
    console.error("Error initializing communities:", error);
    // Don't throw error to prevent server startup failure
  }
};

module.exports = initCommunities;