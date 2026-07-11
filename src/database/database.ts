import Database from "better-sqlite3";
import { ENV } from "../config/env";
import { logger } from "../logger/logger";

export const db = new Database(ENV.DATABASE_PATH);

db.pragma("journal_mode = WAL");

logger.info("SQLite database connected.");