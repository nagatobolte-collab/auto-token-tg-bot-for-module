import Database from "better-sqlite3";
import { ENV } from "../config/env";
import { logger } from "../logger/logger";

logger.info(`DATABASE PATH = ${ENV.DATABASE_PATH}`);

export const db = new Database(ENV.DATABASE_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

logger.info("SQLite database connected.");