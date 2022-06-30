import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { handleIncomingSnapshot } from "../handlers/snapshotHandler";
import { __sds_route__ } from "../constants";

export default async function baseRoutes(fastify: FastifyInstance) {
  fastify.get(
    __sds_route__,
    async (req: FastifyRequest, res: FastifyReply): Promise<void> => {
      const result = await handleIncomingSnapshot(req.query);
      res.code(result.status).send(result.msg);
    }
  );
}
