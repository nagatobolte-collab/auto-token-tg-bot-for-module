import { ENV } from "./config/env";
import { logger } from "./logger/logger";
import "./database/database";
import { bot } from "./bot/bot";

bot.start(async (ctx) => {
    await ctx.reply("🚀 Nagato Auto Token Bot Online");
});

bot.launch();

logger.info("Bot started.");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

logger.info(`Running on port ${ENV.PORT}`);