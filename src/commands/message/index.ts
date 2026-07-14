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



            if (
                "text" in ctx.message
            ) {

                console.log(
                    "TEXT:",
                    ctx.message.text
                );

            }



            if (!ctx.from) {

                return;

            }




            if (
                ctx.chat.type !== "private"
            ) {

                return next();

            }





            if (
                "text" in ctx.message &&
                ctx.message.text.startsWith("/")
            ) {

                return next();

            }





            const user:any =
                UserRepository.findByTelegramId(
                    ctx.from.id
                );



            console.log(
                "USER:",
                user?.state
            );






            /*
                BACKEND FLOW
            */

            if (user) {


                switch (user.state) {



                    /*
                        User selected:
                        ➕ Add Backend

                        Now accept BOTH:

                        1. Firebase URL
                        2. Firebase JSON file

                    */

                    case UserState.WAITING_BACKEND:



                        if (
                            "document" in ctx.message
                        ) {


                            return firebaseJsonHandler(ctx);


                        }



                        return firebaseUrlHandler(ctx);






                    /*
                        Firebase URL flow

                        URL
                        ↓
                        Auth key
                        ↓
                        Connect

                    */

                    case UserState.WAITING_FIREBASE_URL:


                    case UserState.WAITING_FIREBASE_AUTH:



                        return firebaseUrlHandler(ctx);







                    /*
                        Firebase JSON upload flow

                    */

                    case UserState.WAITING_FIREBASE_JSON:



                        return firebaseJsonHandler(ctx);








                    case UserState.WAITING_VPS:



                        return vpsHandler(ctx);



                }


            }










            /*
                OWNER DOCUMENT UPLOAD

            */

            if (
                isOwner(ctx.from.id)
            ) {



                if (
                    "document" in ctx.message
                ) {


                    return firebaseJsonHandler(ctx);


                }





                await ctx.reply(
`<pre>
➕ ADD BACKEND

Upload Firebase JSON
or use Firebase URL.
</pre>`,
                {
                    parse_mode:"HTML"
                });



                return;


            }









            /*
                NEW USER

            */

            if (!user) {


                return licenseHandler(ctx);


            }









            if (
                user.state === UserState.WAITING_LICENSE
            ) {


                return licenseHandler(ctx);


            }








            if (
                "text" in ctx.message
            ) {


                await ctx.reply(
`<pre>
✅ ACCOUNT ACTIVE

Use menu buttons.
</pre>`,
                {
                    parse_mode:"HTML"
                });


            }





        }
    );



}