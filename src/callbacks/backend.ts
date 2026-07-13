import { Telegraf } from "telegraf";

import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";
import { isOwner } from "../utils/isOwner";

export function registerBackendCallbacks(bot: Telegraf) {

    // ==========================================================
    // FIREBASE JSON
    // ==========================================================

    bot.action("backend_firebase_json", async (ctx) => {

        await ctx.answerCbQuery();

        if (!isOwner(ctx.from.id)) {

            const user =
                UserRepository.findByTelegramId(
                    ctx.from.id
                );

            if (!user) {

                await ctx.reply(
                    "❌ Please activate your license first."
                );

                return;

            }

            UserRepository.updateState(

                ctx.from.id,

                UserState.WAITING_FIREBASE_JSON

            );

        }

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
📂 Upload Firebase JSON
Send your Firebase
Service Account JSON file.
━━━━━━━━━━━━━━━━━━━━`
        );

    });

    // ==========================================================
    // FIREBASE URL
    // ==========================================================

    bot.action("backend_firebase_url", async (ctx) => {

        await ctx.answerCbQuery();

        if (!isOwner(ctx.from.id)) {

            const user =
                UserRepository.findByTelegramId(
                    ctx.from.id
                );

            if (!user) {

                await ctx.reply(
                    "❌ Please activate your license first."
                );

                return;

            }

            UserRepository.updateState(

                ctx.from.id,

                UserState.WAITING_FIREBASE_URL

            );

        }

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🌐 Connect Firebase URL
Paste your Firebase
Realtime Database URL.
Example
https://xxxxx-default-rtdb.firebaseio.com
━━━━━━━━━━━━━━━━━━━━`
        );

    });

    // ==========================================================
    // VPS PANEL
    // ==========================================================

    bot.action("backend_vps", async (ctx) => {

        await ctx.answerCbQuery();

        if (!isOwner(ctx.from.id)) {

            const user =
                UserRepository.findByTelegramId(
                    ctx.from.id
                );

            if (!user) {

                await ctx.reply(
                    "❌ Please activate your license first."
                );

                return;

            }

            UserRepository.updateState(

                ctx.from.id,

                UserState.WAITING_VPS

            );

        }

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🖥️ Connect VPS Panel
Paste your VPS Panel URL
or configuration.
━━━━━━━━━━━━━━━━━━━━`
        );

    });

}