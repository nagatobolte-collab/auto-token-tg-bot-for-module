import { Telegraf } from "telegraf";

import { UserRepository } from "../../database/repositories/UserRepository";
import { UserState } from "../../enums/UserState";

import { licenseHandler } from "../../handlers/licenseHandler";
import { firebaseJsonHandler } from "../../handlers/firebaseJsonHandler";
import { firebaseUrlHandler } from "../../handlers/firebaseUrlHandler";
import { vpsHandler } from "../../handlers/vpsHandler";

export function registerMessageHandler(bot: Telegraf) {

    bot.on("message", async (ctx, next) => {

        if (!ctx.from) return;

        if ("text" in ctx.message && ctx.message.text.startsWith("/")) {
            return next();
        }

        const user = UserRepository.findByTelegramId(ctx.from.id);

        if (!user) {
            return licenseHandler(ctx);
        }

        switch (user.state) {

            case UserState.WAITING_LICENSE:
                return licenseHandler(ctx);

            case UserState.WAITING_FIREBASE_JSON:
                return firebaseJsonHandler(ctx);

            case UserState.WAITING_FIREBASE_URL:
                return firebaseUrlHandler(ctx);

            case UserState.WAITING_VPS:
                return vpsHandler(ctx);

            default:
                return;
        }

    });

}