import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env"),
});

function getEnv(name: string, required = true): string {
    const value = process.env[name];

    if (required && (!value || value.trim() === "")) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value ?? "";
}

export const ENV = {
    BOT_TOKEN: getEnv("BOT_TOKEN"),
    OWNER_ID: Number(getEnv("OWNER_ID")),
    PORT: Number(process.env.PORT || 1811),
    DATABASE_PATH: process.env.DATABASE_PATH || "./data/database.db",
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
};