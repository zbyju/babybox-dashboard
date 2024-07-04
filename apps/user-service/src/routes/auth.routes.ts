import { Elysia } from "elysia";
import * as z from "zod";

import UserModel, { type User, type UserSanitized } from "../models/user.model";
import { findUserByUsernameWithPassword } from "../services/user.service";
import { ReturnErr, ReturnOk } from "../utils/api";
import { isValid, signJWT } from "../utils/auth";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const routes = new Elysia()
  .post("/login", async ({ body, error }) => {
    const result = loginSchema.safeParse(body);

    if (!result.success) return ReturnErr(result.error.toString());

    const { username, password } = result.data;
    try {
      // 1. Find user by username
      const userO = await findUserByUsernameWithPassword(username);
      if (userO.isNone())
        return error(
          400,
          ReturnErr("There has been a problem fetching from the database."),
        );

      const user = userO.unwrap();
      if (!user) {
        return error(400, ReturnErr("User not found."));
      }

      // 2. Compare passwords
      const passwordMatch = await Bun.password.verify(password, user.password);
      if (!passwordMatch) {
        return error(400, ReturnErr("Wrong password."));
      }

      // 3. Generate and send a JWT (or other authentication mechanism)
      const token = signJWT(user);
      return ReturnOk({ token: token });
    } catch (err) {
      console.error(err);
      return error(
        500,
        "There has been an error when fetching from the database.",
      );
    }
  })
  .get("/refresh", async ({ headers, error }) => {
    const payload = isValid(headers);

    if (payload === null) {
      return error(401, "JWT is not valid");
    }

    const user: UserSanitized = { ...payload };

    const token = signJWT(user);
    return ReturnOk({ token: token });
  });

export default routes;
