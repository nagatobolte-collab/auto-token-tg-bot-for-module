import { ENV } from "./config/env";
import { logger } from "./logger/logger";

import "./database/database";

import { initializeDatabase } from "./database/schema/init";

import { bot } from "./bot/bot";

import { registerStartCommand } from "./commands/start";
import { registerGenKeyCommand } from "./commands/genkey";
import { registerMessageHandler } from "./commands/message";
import { registerSetupCallbacks } from "./callbacks/setup";
import { registerVerifyChatCommand } from "./commands/verifychat";
import { registerBackendCallbacks } from "./callbacks/backend";
import { startMessageCleanupWorker } from "./workers/MessageCleanupWorker";
import { registerFindDeviceCommand } from "./commands/finddevice";
import { registerDeviceCallbacks } from "./callbacks/device";
import { registerStartMonitorCommand } from "./commands/startmonitor";
import { registerStopMonitorCommand } from "./commands/stopmonitor";
import { registerGroupMessageHandler } from "./handlers/groupMessageHandler";
import { startMonitoringWorker } from "./workers/MonitoringWorker";
import { startSenderWorker } from "./workers/SenderWorker";
import { registerMenuCommands } from "./commands/menu";
import { startFirebaseSmsListener } from "./workers/FirebaseSmsListener";
import { registerSetKeyCommand } from "./commands/setkey";

initializeDatabase();

startMessageCleanupWorker();
startMonitoringWorker();
startSenderWorker();
startFirebaseSmsListener();
registerStartCommand(bot);
registerGenKeyCommand(bot);

registerBackendCallbacks(bot);
registerDeviceCallbacks(bot);

registerVerifyChatCommand(bot);
registerMessageHandler(bot);
registerGroupMessageHandler(bot);

registerSetupCallbacks(bot);

registerFindDeviceCommand(bot);
registerStartMonitorCommand(bot);
registerStopMonitorCommand(bot);
registerSetKeyCommand(bot);
registerMenuCommands(bot);
(async () => {

    try {

        logger.info("Deleting webhook...");

        await bot.telegram.deleteWebhook({
            drop_pending_updates: true
        });

        logger.info("Webhook deleted");

        const me = await bot.telegram.getMe();

        logger.info(`Logged in as @${me.username}`);

        await bot.launch({
            dropPendingUpdates: true
        });

        logger.info("Bot started.");
        logger.info(`Running on port ${ENV.PORT}`);

    } catch (err) {

        console.error(err);

    }

})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));