import { Context } from "telegraf";

import { VpsProvider } from "../backends/vps/VpsProvider";

import { UserRepository } from "../database/repositories/UserRepository";

import { UserState } from "../enums/UserState";


export async function vpsHandler(
    ctx: Context
){


    if(!ctx.from){
        return;
    }


    if(
        !ctx.message ||
        !("text" in ctx.message)
    ){

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ Invalid Input

Please send VPS URL only.
━━━━━━━━━━━━━━━━━━━━`
        );

        return;

    }



    const url =
        ctx.message.text.trim();



    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🔄 Connecting VPS...

Checking API
and syncing devices.
━━━━━━━━━━━━━━━━━━━━`
    );



    const result =
        await VpsProvider.import(

            ctx.from.id,

            url

        );



    if(!result.success){


        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ VPS Connection Failed

${result.message}

Please check your VPS URL.
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
✅ VPS Connected
🌐 Server: ${result.backendIdentifier}
📱 Devices Found: ${result.totalDevices}
🟢 Status: Online
Backend saved successfully.
━━━━━━━━━━━━━━━━━━━━`
    );


}