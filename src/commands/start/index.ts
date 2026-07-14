import { Telegraf } from "telegraf";

import { ENV } from "../../config/env";

import { UserService } from "../../services/UserService";

import { mainKeyboard } from "../../keyboards/mainKeyboard";

import { UserState } from "../../enums/UserState";

import { setUserCommands } from "../../services/BotCommandsService";


export function registerStartCommand(
    bot: Telegraf
) {


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
        // ACCESS DENIED
        // =====================================================

        if (!user) {


            await ctx.reply(
`🔒 Access Denied
━━━━━━━━━━━━━━━━━━━━
⚠️ You are not authorized to use this bot.
To get access, purchase an activation key from:

👤 @btcshadow
━━━━━━━━━━━━━━━━━━━━
Already have a key?
Paste your activation key below.

Example:
AUTO-TOKEN-BOTX-A8F2K9LQ`,
            {
                parse_mode:"Markdown"
            });


            return;

        }





        // =====================================================
        // ENABLE COMMAND MENU
        // =====================================================

        await setUserCommands(

            bot,

            telegramId,

            isOwner

        );






        // =====================================================
        // OWNER PANEL
        // =====================================================

        if (isOwner) {


            await ctx.reply(
`👑 *Owner Panel*
Welcome back!

Available Commands
/genkey
/allusers
/finddevice
/searchmsg
/profile
━━━━━━━━━━━━━━
You can also use all normal user features.`,
            {
                parse_mode:"Markdown",
                ...mainKeyboard
            });


        }





        // =====================================================
        // USER STATE
        // =====================================================

        switch(user.state) {



            case UserState.WAITING_GROUP:


                await ctx.reply(

                    "📌 Setup required\n\nPlease verify your Telegram group.",

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

Use:

/finddevice <device_id>`,
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


                break;


        }



    });


}