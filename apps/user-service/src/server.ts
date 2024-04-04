// src/server.ts
import { Elysia } from "elysia";

import connectDB from "./db";

import userRoutes from "./routes/user.routes";
import { healthcheckHandler } from "./routes/misc.routes";
import logger from "./services/logger";
import authRoutes from "./routes/auth.routes";
import { isAuthenticated } from "./utils/auth";
import { cors } from "@elysiajs/cors";

// Connect to MongoDB
connectDB();

// Initialize Elysia server
const server = new Elysia()
  .use(cors())
  .get("/healthcheck", healthcheckHandler)
  .group("/v1", (app) =>
    app
      .group("/auth", (app) => app.use(authRoutes))
      .group("/users", (app) =>
        app
          .onBeforeHandle(({ headers, error }) => {
            const { isAuth } = isAuthenticated(headers);
            if (isAuth === false) {
              return error(401, "Unauthorized");
            }
          })
          .use(userRoutes),
      ),
  );

// Start the server
const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
