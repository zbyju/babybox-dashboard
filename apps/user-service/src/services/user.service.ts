import UserModel, { type User, type UserSanitized } from "../models/user.model";
import { type Option, Some, None } from "../utils/errors";

export const createUser = async (userData: {
  username: string;
  password: string;
  email: string;
}): Promise<Option<UserSanitized>> => {
  try {
    const newUser = new UserModel(userData);
    await newUser.save();

    const sanitizedUser = {
      ...newUser.toObject(),
      password: undefined,
      _id: undefined,
      __v: undefined,
    };

    return new Some(sanitizedUser);
  } catch (error) {
    console.log(error);
    return new None();
  }
};

export const findUserByUsername = async (
  username: string,
): Promise<Option<UserSanitized>> => {
  const user = await UserModel.findOne({ username }, "-_id -__v -password");
  if (!user) {
    return new None();
  }
  return new Some(user);
};

export const deleteUserByUsername = async (
  username: string,
): Promise<boolean> => {
  try {
    await UserModel.deleteOne({ username });
    return true;
  } catch (err) {
    return false;
  }
};

export const findUserByUsernameWithPassword = async (
  username: string,
): Promise<Option<User>> => {
  const user = await UserModel.findOne({ username }, "-_id -__v");
  if (!user) {
    return new None();
  }
  return new Some(user);
};

export const findAllUsers = async (): Promise<Option<UserSanitized[]>> => {
  const user = await UserModel.find({}, "-_id -__v -password");
  if (!user) {
    return new None();
  }
  return new Some(user);
};
