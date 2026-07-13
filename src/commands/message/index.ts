import { Telegraf } from "telegraf";

import { UserRepository } from "../../database/repositories/UserRepository";
import { UserState } from "../../enums/UserState";

import { licenseHandler } from "../../handlers/licenseHandler";
import { firebaseJsonHandler } from "../../handlers/firebaseJsonHandler";
import { firebaseUrlHandler } from "../../handlers/firebaseUrlHandler";
import { vpsHandler } from "../../handlers/vpsHandler";

import { isOwner } from "../../utils/isOwner";

export function registerMessageHandler(bot: Telegraf) {

    bot.on("message", async (ctx, next) => {

        console.log("========== MESSAGE HANDLER ==========");
        console.log("CHAT TYPE:", ctx.chat.type);

        if ("text" in ctx.message) {
            console.log("TEXT:", ctx.message.text);
        }

        if (!ctx.from) {
            console.log("NO ctx.from");
            return;
        }

        // PRIVATE ONLY
        if (ctx.chat.type !== "private") {

            console.log("NOT PRIVATE -> NEXT()");
            return next();

        }

        console.log("PRIVATE CHAT");

        // Ignore commands
        if ("text" in ctx.message && ctx.message.text.startsWith("/")) {

            console.log("COMMAND -> NEXT()");
            return next();

        }

        if (isOwner(ctx.from.id)) {

            console.log("OWNER");

            if ("document" in ctx.message) {
                return firebaseJsonHandler(ctx);
            }

            if ("text" in ctx.message) {

                await ctx.reply(
`👑 Development Mode

Upload a Firebase JSON file or use the available commands.`
                );

            }

            return;

        }

        const user =
            UserRepository.findByTelegramId(
                ctx.from.id
            );

        console.log("USER:", user);

        if (!user) {

            console.log("CALLING LICENSE HANDLER");

            return licenseHandler(ctx);

        }

        switch (user.state) {

            case UserState.WAITING_LICENSE:
                console.log("WAITING_LICENSE");
                return licenseHandler(ctx);

            case UserState.WAITING_FIREBASE_JSON:
                return firebaseJsonHandler(ctx);

            case UserState.WAITING_FIREBASE_URL:
                return firebaseUrlHandler(ctx);

            case UserState.WAITING_VPS:
                return vpsHandler(ctx);

            default:

                if ("text" in ctx.message) {

                    await ctx.reply(
`✅ Your account is already activated.
Use the menu buttons or available commands.`
                    );

                }

                return;

        }

    });

}