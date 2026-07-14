import { Context } from "telegraf";

import { FirebaseUrlProvider } from "../backends/firebase/FirebaseUrlProvider";

import { UserRepository } from "../database/repositories/UserRepository";

import { UserState } from "../enums/UserState";



export async function firebaseUrlHandler(
    ctx:Context
){

    if(!ctx.from){
        return;
    }



    if(
        !ctx.message ||
        !("text" in ctx.message)
    ){

        await ctx.reply(
`<pre>
❌ INVALID INPUT

Please send Firebase
Realtime Database URL.
</pre>`,
        {
            parse_mode:"HTML"
        });

        return;

    }




    let text =
        ctx.message.text
        .trim()
        .replace(/\s+/g,"")
        .replace(/^["']|["']$/g,"");




    const user:any =
        UserRepository.findByTelegramId(
            ctx.from.id
        );




    /*
        STEP 1
        USER SENDS FIREBASE URL
    */

    if(
        user?.state === UserState.WAITING_BACKEND ||
        user?.state === UserState.WAITING_FIREBASE_URL
    ){



        if(
            !(
                text.includes("firebaseio.com") ||
                text.includes("firebasedatabase.app")
            )
        ){

            await ctx.reply(
`<pre>
❌ INVALID FIREBASE URL

Supported:

.firebaseio.com

or

.firebasedatabase.app
</pre>`,
            {
                parse_mode:"HTML"
            });


            return;

        }




        UserRepository.setFirebaseUrl(

            ctx.from.id,

            text

        );



        UserRepository.updateState(

            ctx.from.id,

            UserState.WAITING_FIREBASE_AUTH

        );





        await ctx.reply(
`<pre>
🔐 FIREBASE AUTHENTICATION REQUIRED

Your database is protected.

Send Firebase Auth Key:
</pre>`,
        {
            parse_mode:"HTML"
        });



        return;

    }






    /*
        STEP 2
        USER SENDS AUTH KEY
    */


    if(
        user?.state === UserState.WAITING_FIREBASE_AUTH
    ){



        const firebaseUrl =
            UserRepository.getFirebaseUrl(
                ctx.from.id
            );



        if(!firebaseUrl){


            await ctx.reply(
`<pre>
❌ SESSION EXPIRED

Please add Firebase again.
</pre>`,
            {
                parse_mode:"HTML"
            });


            return;

        }





        const authKey =
            text;




        await ctx.reply(
`<pre>
🔄 VERIFYING FIREBASE

Connecting database...
Please wait.
</pre>`,
        {
            parse_mode:"HTML"
        });







        const result =
            await FirebaseUrlProvider.import(

                ctx.from.id,

                firebaseUrl,

                authKey

            );







        if(!result.success){



            await ctx.reply(
`<pre>
❌ FIREBASE CONNECTION FAILED

${result.message}

Check Auth Key and try again.
</pre>`,
            {
                parse_mode:"HTML"
            });



            return;

        }








        UserRepository.clearFirebasePending();



        UserRepository.updateState(

            ctx.from.id,

            UserState.READY

        );







        await ctx.reply(
`<pre>
✅ FIREBASE CONNECTED
🌐 DATABASE
${result.backendIdentifier}
📱 DEVICES
${result.totalDevices}
🟢 STATUS: ONLINE
⚡ SMS STREAM READY
</pre>`,
        {
            parse_mode:"HTML"
        });



        return;

    }





}