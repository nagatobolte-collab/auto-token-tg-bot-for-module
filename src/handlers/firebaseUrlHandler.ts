import { Context } from "telegraf";

import { FirebaseUrlProvider } from "../backends/firebase/FirebaseUrlProvider";
import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";


export async function firebaseUrlHandler(
    ctx: Context
) {

    if (!ctx.from) {
        return;
    }

    if (!ctx.message || !("text" in ctx.message)) {

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ Invalid Input
Please send only your
Firebase Realtime Database URL.
━━━━━━━━━━━━━━━━━━━━`
        );

        return;

    }


    const url =
        ctx.message.text.trim();


    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🔄 Connecting Firebase...
Checking database
and syncing devices.
━━━━━━━━━━━━━━━━━━━━`
    );


    const result =
        await FirebaseUrlProvider.import(

            ctx.from.id,

            url

        );


    if (!result.success) {

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ Firebase Connection Failed
${result.message}
Please check your URL.
━━━━━━━━━━━━━━━━━━━━`
        );

        return;

    }


    UserRepository.updateState(

        ctx.from.id,

        UserState.READY

    );


    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ Firebase Connected
🌐 Database
${result.backendIdentifier}
📱 Devices Found
${result.totalDevices}
🟢 Status
Online
Backend saved successfully.
━━━━━━━━━━━━━━━━━━━━`
    );

}