import { Telegraf } from "telegraf";

export function registerMenuCommands(
    bot: Telegraf
) {

    bot.hears(
        "➕ Add Backend",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/setfirebase"
            );

        }
    );

    bot.hears(
        "📱 Find Device",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/finddevice"
            );

        }
    );

    bot.hears(
        "📡 Start Monitor",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/startmonitor"
            );

        }
    );

    bot.hears(
        "🛑 Stop Monitor",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/stopmonitor"
            );

        }
    );

    bot.hears(
        "👤 Profile",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/profile"
            );

        }
    );

    bot.hears(
        "❓ Help",
        async (ctx) => {

            await ctx.telegram.sendMessage(
                ctx.chat.id,
                "/help"
            );

        }
    );

}