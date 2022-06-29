import cors from "@fastify/cors";
import Fastify from "fastify";
import baseRoute from "./routes/base.route";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import { __base_prefix__ } from "./constants";

const prisma = new PrismaClient();

const main = async () => {
  // Load .env variables
  dotenv.config({ path: "../../packages/config/.env" });

  const fastify = Fastify({ logger: true });

  // Enable cors
  fastify.register(cors);

  // Enable all routes
  fastify.register(baseRoute, { prefix: __base_prefix__ });

  // Connect to db
  await prisma.$connect();

  fastify.listen(3000, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

main()
  .catch((err) => {
    console.log(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
