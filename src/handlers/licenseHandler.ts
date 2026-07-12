import { Context } from "telegraf";

import { LicenseService } from "../services/LicenseService";
import { setupKeyboard } from "../keyboards/setupKeyboard";

export async function licenseHandler(ctx: Context) {

    if (!ctx.from || !("text" in ctx.message!)) {
        return;
    }

    const result = LicenseService.activateKey(
        ctx.message.text.trim(),
        ctx.from.id,
        {
            username: ctx.from.username,
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name
        }
    );

    if (!result.success) {
        await ctx.reply(result.message);
        return;
    }

    await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🎉 License Activated
✅ Plan
${result.plan}

Welcome 👋

Complete these steps:
1️⃣ Add this bot to your monitoring group.
2️⃣ Return here.
3️⃣ Continue setup.
━━━━━━━━━━━━━━━━━━━━`,
        setupKeyboard
    );

}