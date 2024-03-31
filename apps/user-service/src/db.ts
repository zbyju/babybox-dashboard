import mongoose from "mongoose";

const connectDB = async () => {
  const dbName = process.env.MONGODB_DATABASE;
  try {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
