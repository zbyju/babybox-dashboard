const pino = require("pino");
const logger =
  process.env.NODE_ENV === "development"
    ? pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      })
    : pino();

export default logger;
