import { Telegraf } from "telegraf";

import { UserRepository } from "../../database/repositories/UserRepository";
import { UserState } from "../../enums/UserState";


export function registerMenuCommands(
    bot: Telegraf
) {


    bot.hears(
        "➕ Add Backend",
        async (ctx) => {


            UserRepository.updateState(

                ctx.from.id,

                UserState.WAITING_BACKEND

            );


            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
➕ Add Backend
Send your backend:
🌐 Firebase URL
Example:
https://xxxxx.firebaseio.com
or
https://xxxxx.firebasedatabase.app
📂 Firebase JSON
🖥️ VPS API
(coming)
━━━━━━━━━━━━━━━━━━━━`
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