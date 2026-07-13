import { Telegraf } from "telegraf";

import { ENV } from "../../config/env";

import { UserService } from "../../services/UserService";

import { Messages } from "../../constants/messages";

import { mainKeyboard } from "../../keyboards/mainKeyboard";

import { UserState } from "../../enums/UserState";

export function registerStartCommand(bot: Telegraf) {

    bot.start(async (ctx) => {

        if (!ctx.from) {
            return;
        }

        const telegramId =
            ctx.from.id;


        const isOwner =
            telegramId === ENV.OWNER_ID;


        let user =
            UserService.getUser(
                telegramId
            );


        // =====================================================
        // OWNER INITIALIZATION
        // =====================================================

        if (!user && isOwner) {

            UserService.createOwner({

                telegramId,

                username:
                    ctx.from.username,

                firstName:
                    ctx.from.first_name,

                lastName:
                    ctx.from.last_name

            });


            user =
                UserService.getUser(
                    telegramId
                );

        }


        // =====================================================
        // OWNER PANEL
        // =====================================================

        if (isOwner) {

            await ctx.reply(
`👑 Owner Panel

Welcome back!

Available Commands
/genkey
/allusers
/finddevice
/searchmsg
/profile

━━━━━━━━━━━━━━

You can also use all normal user features.`,
                mainKeyboard
            );

        }


        // =====================================================
        // NORMAL USER WITHOUT ACCOUNT
        // =====================================================

        if (!user) {

            await ctx.reply(
                Messages.ACCESS_DENIED
            );

            return;

        }


        // =====================================================
        // USER STATE
        // =====================================================

        switch (user.state) {


            case UserState.WAITING_GROUP:

                await ctx.reply(
                    Messages.SETUP,
                    mainKeyboard
                );

                break;


            case UserState.WAITING_BACKEND:

                await ctx.reply(
`📌 Next Step

➕ Connect your first backend.`,
                    mainKeyboard
                );

                break;


            case UserState.WAITING_DEVICE:

                await ctx.reply(
`📱 Next Step

Use /finddevice <device_id>`,
                    mainKeyboard
                );

                break;


            case UserState.READY:

                await ctx.reply(
`🟢 Nagato Auto Token

License : Active
Status : Ready`,
                    mainKeyboard
                );

                break;


            default:

                if (!isOwner) {

                    await ctx.reply(
                        Messages.ACCESS_DENIED
                    );

                }

                break;

        }

    });

}