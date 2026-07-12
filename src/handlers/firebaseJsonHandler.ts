import { Context } from "telegraf";
import { BackendManager } from "../core/BackendManager";

export async function firebaseJsonHandler(
    ctx: Context
) {

    const result = await BackendManager.import(ctx);

    if (!result.success) {

        await ctx.reply(result.message);

        return;

    }

    await ctx.reply(
`✅ Firebase Connected

Project
${result.backendIdentifier}

📱 Devices Found
${result.totalDevices}

Synchronization completed successfully.`
    );

}