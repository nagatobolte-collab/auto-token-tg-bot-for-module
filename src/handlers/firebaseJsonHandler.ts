import { Context } from "telegraf";

import { BackendManager } from "../core/BackendManager";

export async function firebaseJsonHandler(
    ctx: Context
) {

    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🔄 Connecting Backend...
Please wait while I verify
your Firebase project.
━━━━━━━━━━━━━━━━━━━━`
    );

    const result =
        await BackendManager.import(ctx);

    if (!result.success) {

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ Connection Failed
${result.message}
━━━━━━━━━━━━━━━━━━━━`
        );

        return;

    }

    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ Backend Connected
📂 Project: ${result.backendIdentifier}
📱 Devices Found: ${result.totalDevices}
🟢 Status: Online
━━━━━━━━━━━━━━━━━━━━
Your backend is ready.
Next Step
/finddevice
━━━━━━━━━━━━━━━━━━━━`
    );

}