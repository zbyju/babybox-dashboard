import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { handleIncomingData } from "../handlers/dataHandler";
import { __sds_route__ } from "../constants";

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.get(
    __sds_route__,
    async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
      handleIncomingData(req.query);
      res.send("Data received");
    }
  );
}
