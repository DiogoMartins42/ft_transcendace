import path from "node:path";
import envSchema from "env-schema";

const schema = {
  type: "object",
  required: ["PORT", "LOG_LEVEL", "NODE_ENV", "DB_FILE", "JWT_SECRET"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    LOG_LEVEL: {
      type: "string",
      default: "info",
    },
    NODE_ENV: {
      type: "string",
      default: "development",
      enum: ["development", "testing", "production", "staging"],
    },
    DB_FILE: {
      type: "string",
      default: "./pongpong.db",
    },
    JWT_SECRET: { 
      type: "string" 
    },
    // OAuth Configuration (optional)
    GOOGLE_CLIENT_ID: {
      type: "string",
      default: ""
    },
    GOOGLE_CLIENT_SECRET: {
      type: "string",
      default: ""
    }
  },
};

const config = envSchema({
  schema: schema,
  dotenv: {
    path: path.resolve(process.cwd(), ".env")
  },
});

const envConfig = {
  port: config.PORT,
  logLevel: config.LOG_LEVEL,
  nodeEnv: config.NODE_ENV,
  dbFile: config.DB_FILE,
  JWT_SECRET: config.JWT_SECRET,
  GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET
};

export default envConfig;