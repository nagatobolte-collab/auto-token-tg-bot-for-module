import { ENV } from "./config/env";
import { logger } from "./logger/logger";
import "./database/database";

import { initializeDatabase } from "./database/schema/init";
import { bot } from "./bot/bot";

// Initialize database
initializeDatabase();

// Start command
bot.start(async (ctx) => {
    await ctx.reply("🚀 Nagato Auto Token Bot Online");
});

// Launch bot
bot.launch();

logger.info("Bot started.");
logger.info(`Running on port ${ENV.PORT}`);

// Graceful shutdown
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));