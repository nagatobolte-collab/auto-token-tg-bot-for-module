import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.on("text", (ctx) => {
    console.log("Message:", ctx.message.text);
});

(async () => {

    console.log("Deleting webhook...");
    await bot.telegram.deleteWebhook({
        drop_pending_updates: true,
    });

    console.log("Starting polling...");

    // IMPORTANT: don't await launch
    bot.launch({
        dropPendingUpdates: true,
    });

    console.log("Launch called");

})();