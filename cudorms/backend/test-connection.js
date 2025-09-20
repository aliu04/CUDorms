import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import process from "process";

const mongoDBURL = process.env.MONGODB_URL;

async function testConnection() {
  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    console.log(
      "📍 Connection URL:",
      mongoDBURL?.replace(/\/\/.*@/, "//***:***@") || "No URL configured"
    );

    if (!mongoDBURL) {
      throw new Error(
        "MONGODB_URL is not configured. Please set it in your .env file."
      );
    }

    await mongoose.connect(mongoDBURL);

    console.log("✅ Successfully connected to MongoDB!");
    console.log("📊 Database name:", mongoose.connection.db.databaseName);

    // Test creating a simple document
    const testCollection = mongoose.connection.db.collection("connection-test");
    await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: "CUDorms connection test successful!",
    });

    console.log("✅ Test document created successfully!");

    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log("🧹 Test document cleaned up!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("authentication failed")) {
      console.log(
        "\n💡 Tip: Check your username and password in the connection string"
      );
    } else if (error.message.includes("network")) {
      console.log(
        "\n💡 Tip: Check your network access settings in MongoDB Atlas"
      );
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Tip: Check your cluster URL in the connection string");
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

testConnection();
