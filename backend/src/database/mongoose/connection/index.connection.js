import mongoose from "mongoose";

/**
 * @function connectDB
 * @description Connecting app to MongoDB using Mongoose
 */

const connectMongoDB = async () => {
  try {
  
    const conn = await mongoose.connect(
      process.env.MONGO_DB_URI, {
      dbName: "mediaRoom",
    }
    );

    console.log(`MongoDB Connected`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // stop app if DB fails
  }
};
export default connectMongoDB;
