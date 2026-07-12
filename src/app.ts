import { ENV } from "./config/env";
import { logger } from "./logger/logger";

import "./database/database";

import { initializeDatabase } from "./database/schema/init";

import { bot } from "./bot/bot";

import { registerStartCommand } from "./commands/start";
import { registerGenKeyCommand } from "./commands/genkey";
import { registerMessageHandler } from "./commands/message";
import { registerSetupCallbacks } from "./callbacks/setup";

initializeDatabase();

registerStartCommand(bot);
registerGenKeyCommand(bot);
registerMessageHandler(bot);
registerSetupCallbacks(bot);

bot.launch();

logger.info("Bot started.");
logger.info(`Running on port ${ENV.PORT}`);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));