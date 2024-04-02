import { type CallbackError, model, Schema } from "mongoose";

export interface UserSanitized {
  username: string;
  email: string;
}

export interface User extends UserSanitized {
  password: string;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await Bun.password.hash(this.password);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});
const UserModel = model<User>("User", userSchema);

export default UserModel;
