import cors from "@fastify/cors"
import Fastify from "fastify"
import baseRoute from "./routes/base.route"

import { __base_prefix__ } from "./constants"

const main = () => {
    const fastify = Fastify({ logger: true })

    // Enable cors
    fastify.register(cors)

    // Enable all routes
    fastify.register(baseRoute, { prefix: __base_prefix__ })

    fastify.listen(3000, (err) => {
        if(err) {
            fastify.log.error(err)
            process.exit(1)
        }
    })
}

main()
