import mongoose from "mongoose";

import logger from "./services/logger";
import { createUser, findAllUsers } from "./services/user.service";

const connectDB = async () => {
  const dbName = process.env.MONGODB_DATABASE;
  try {
    await mongoose.connect(`mongodb://mongodb:27017/${dbName}`);
    logger.info(`Connected to MongoDB`);
  } catch (error) {
    logger.error("Error when connecting to MongoDB: ", error);
    process.exit(1);
  }

  try {
    const users = await findAllUsers();
    if (users.isSome() && users.unwrap.length !== 0) return;

    const defaultUser = process.env.DEFAULT_USERNAME;
    const defaultPassword = process.env.DEFAULT_PASSWORD;
    const defaultEmail = process.env.DEFAULT_EMAIL;
    if (!defaultUser || !defaultPassword || !defaultEmail) {
      logger.error(
        `Couldn't create default user: ${defaultUser} ${defaultPassword} ${defaultEmail}`,
      );
      return;
    }
    await createUser({
      username: defaultUser,
      password: defaultPassword,
      email: defaultEmail,
    });

    logger.info("Created default user");
  } catch (err) {
    logger.error(err);
  }
};

export default connectDB;
