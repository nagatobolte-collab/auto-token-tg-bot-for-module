import { Telegraf } from "telegraf";

import { UserRepository } from "../../database/repositories/UserRepository";
import { UserState } from "../../enums/UserState";

import { licenseHandler } from "../../handlers/licenseHandler";
import { firebaseJsonHandler } from "../../handlers/firebaseJsonHandler";
import { firebaseUrlHandler } from "../../handlers/firebaseUrlHandler";
import { vpsHandler } from "../../handlers/vpsHandler";

import { isOwner } from "../../utils/isOwner";


export function registerMessageHandler(
    bot: Telegraf
) {


    bot.on(
        "message",
        async (ctx, next) => {


            console.log(
                "========== MESSAGE HANDLER =========="
            );


            console.log(
                "CHAT TYPE:",
                ctx.chat.type
            );


            if ("text" in ctx.message) {

                console.log(
                    "TEXT:",
                    ctx.message.text
                );

            }



            if (!ctx.from) {
                return;
            }




            // PRIVATE ONLY

            if (ctx.chat.type !== "private") {

                return next();

            }




            // Ignore commands

            if (
                "text" in ctx.message &&
                ctx.message.text.startsWith("/")
            ) {

                return next();

            }





            const user =
                UserRepository.findByTelegramId(
                    ctx.from.id
                );


            console.log(
                "USER:",
                user
            );






            /*
                BACKEND FLOW

                Handles:
                WAITING_BACKEND
                WAITING_FIREBASE_JSON
                WAITING_FIREBASE_URL
                WAITING_VPS
            */


            if (user) {


                switch(user.state) {


                    case UserState.WAITING_BACKEND:

                        console.log(
                            "WAITING_BACKEND"
                        );

                        return firebaseUrlHandler(ctx);



                    case UserState.WAITING_FIREBASE_JSON:

                        return firebaseJsonHandler(ctx);



                    case UserState.WAITING_FIREBASE_URL:

                        return firebaseUrlHandler(ctx);



                    case UserState.WAITING_VPS:

                        return vpsHandler(ctx);


                }

            }





            /*
                OWNER FLOW

            */


            if (
                isOwner(ctx.from.id)
            ) {


                console.log(
                    "OWNER"
                );


                if (
                    "document" in ctx.message
                ) {

                    return firebaseJsonHandler(ctx);

                }


                await ctx.reply(
`Upload Firebase JSON or press Add Backend.`
                );


                return;

            }






            /*
                NEW USER
            */


            if (!user) {


                return licenseHandler(ctx);


            }





            switch(user.state) {


                case UserState.WAITING_LICENSE:

                    return licenseHandler(ctx);



                default:


                    if ("text" in ctx.message) {


                        await ctx.reply(
`✅ Your account is already activated.

Use the menu buttons or available commands.`
                        );


                    }


                    return;


            }


        }
    );


}