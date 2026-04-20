const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// Set a longer timeout for initial connection
mongoose.set("bufferTimeoutMS", 20000); // 20 seconds instead of 10

class Database {
  constructor(uri, options) {
    this.uri = uri;
    this.options = {
      ...options,
      serverSelectionTimeoutMS: 20000, // 20 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };
  }

  async connect({ retries = Infinity, baseDelayMs = 2000, maxDelayMs = 60000 } = {}) {
    let attempt = 0;
    while (true) {
      attempt++;
      try {
        console.log(`Attempting to connect to MongoDB (attempt ${attempt})...`);
        await mongoose.connect(this.uri, this.options);
        console.log(
          `Connected to database: ${mongoose.connection.db.databaseName}`
        );

        mongoose.connection.on("error", (err) => {
          console.error("MongoDB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
          console.log("MongoDB disconnected");
        });

        return;
      } catch (error) {
        console.error(
          `Failed to connect to MongoDB (attempt ${attempt}):`,
          error.message
        );
        if (attempt >= retries) {
          throw error;
        }
        const delay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
        console.log(`Retrying in ${Math.round(delay / 1000)}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(
        `Disconnected from database: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Database;
