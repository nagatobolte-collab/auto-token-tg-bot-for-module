import winston from "winston";
import { ENV } from "../config/env";

export const logger = winston.createLogger({
    level: ENV.LOG_LEVEL,

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()} : ${message}`;
        })
    ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        new winston.transports.File({
            filename: "logs/bot.log",
        }),
    ],
});