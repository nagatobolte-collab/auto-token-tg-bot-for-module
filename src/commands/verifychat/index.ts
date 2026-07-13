import { Telegraf } from "telegraf";

import { VerificationCodeService } from "../../services/verify/VerificationCodeService";
import { VerificationRepository } from "../../database/repositories/VerificationRepository";

export function registerVerifyChatCommand(bot: Telegraf) {

    bot.command("verifychat", async (ctx) => {

        if (!ctx.from) {
            return;
        }

        const code =
            VerificationCodeService.generate();

        // Store expiry as Unix timestamp (milliseconds)
        const expires =
            Date.now() + (5 * 60 * 1000);

        VerificationRepository.create({

            telegramId: ctx.from.id,

            code,

            expiresAt: expires

        });

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🔐 *Nagato Verification*
\`${code}\`
📋 *Tap the code above to copy.*
Paste it into the Telegram
*Group* or *Channel*
you want to monitor.
⏳ Expires in *5 minutes.*
━━━━━━━━━━━━━━━━━━━━`,
            {
                parse_mode: "Markdown"
            }
        );

    });

}