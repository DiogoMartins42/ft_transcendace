import pino from "pino";
import env from "./env.js";

const options = {
  level: env.logLevel,
  formatters: {
    bindings: (bindings) => ({ pid: bindings.pid, host: bindings.hostname }),
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

const logger = pino(options);

export default logger;
export { options };
