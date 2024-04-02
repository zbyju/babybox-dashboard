import mongoose from "mongoose";
import logger from "./services/logger";

const connectDB = async () => {
  const dbName = process.env.MONGODB_DATABASE;
  try {
    await mongoose.connect(`mongodb://mongodb:27017/${dbName}`);
    logger.info(`Connected to MongoDB`);
  } catch (error) {
    logger.error("Error when connecting to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
