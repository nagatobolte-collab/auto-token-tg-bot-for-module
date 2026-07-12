import { Telegraf } from "telegraf";
import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";

export function registerBackendCallbacks(bot: Telegraf) {

    bot.action(
        "backend_firebase_json",
        async (ctx) => {

            await ctx.answerCbQuery();

            UserRepository.updateState(
                ctx.from.id,
                UserState.WAITING_FIREBASE_JSON
            );

            await ctx.reply(
`📄 Send your Firebase Service Account JSON file.`
            );

        }
    );

    bot.action(
        "backend_firebase_url",
        async (ctx) => {

            await ctx.answerCbQuery();

            UserRepository.updateState(
                ctx.from.id,
                UserState.WAITING_FIREBASE_URL
            );

            await ctx.reply(
`🌐 Send your Firebase Database URL.`
            );

        }
    );

    bot.action(
        "backend_vps",
        async (ctx) => {

            await ctx.answerCbQuery();

            UserRepository.updateState(
                ctx.from.id,
                UserState.WAITING_VPS
            );

            await ctx.reply(
`🖥️ Send your VPS Panel URL or configuration.`
            );

        }
    );

}