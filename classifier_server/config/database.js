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

  async connect() {
    try {
      console.log("Attempting to connect to MongoDB...");
      await mongoose.connect(this.uri, this.options);
      console.log(
        `Connected to database: ${mongoose.connection.db.databaseName}`
      );
      
      // Handle connection events
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });
      
      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });
      
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error.message);
      throw error;
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
