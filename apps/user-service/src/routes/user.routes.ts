import { Elysia } from "elysia";
import * as z from "zod";

import {
  createUser,
  deleteUserByUsername,
  findAllUsers,
  findUserByUsername,
} from "../services/user.service";
import { ReturnErr, ReturnOk } from "../utils/api";

export const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
});

const routes = new Elysia()
  .get("/", async ({ error }) => {
    const usersO = await findAllUsers();
    if (usersO.isNone())
      return error(
        500,
        ReturnErr("There has been an error when fetching from the database"),
      );
    const users = usersO.unwrap();
    return ReturnOk(users);
  })
  .get("/:username", async ({ params: { username }, error }) => {
    const userO = await findUserByUsername(username);
    if (userO.isNone())
      return error(
        500,
        ReturnErr("There has been an error when fetching from the database"),
      );
    const users = userO.unwrap();
    return ReturnOk(users);
  })
  .delete("/:username", async ({ params: { username }, error }) => {
    const success = await deleteUserByUsername(username);
    if (!success)
      return error(
        500,
        ReturnErr("There has been an error when deleting from the database"),
      );
    return ReturnOk({ success: true, username });
  })
  .post("/", async ({ body, error }) => {
    const result = userSchema.safeParse(body);

    if (!result.success) return error(400, ReturnErr(result.error.toString()));

    const userO = await createUser(result.data);
    if (userO.isNone())
      return error(
        500,
        ReturnErr("There has been an error when saving to the database"),
      );
    const user = userO.unwrap();
    return ReturnOk(user);
  });

export default routes;
