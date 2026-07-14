import { Telegraf } from "telegraf";

import { MonitorChatRepository } from "../database/repositories/MonitorChatRepository";

export function registerSetupCallbacks(bot: Telegraf) {

    bot.action("verify_group", async (ctx) => {

        await ctx.answerCbQuery();

        if (!ctx.from) {
            return;
        }

        const chat =
            MonitorChatRepository.findByTelegramId(
                ctx.from.id
            );

        if (!chat) {

            await ctx.reply(
`❌ No Telegram Chat Verified
add bot to your group or channel first
━━━━━━━━━━━━━━━━━━━━
Use /verifychat Then
paste the generated verification code
inside your Telegram Group,
Supergroup or Channel.
━━━━━━━━━━━━━━━━━━━━`
            );

            return;

        }

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ Telegram Chat Verified
📢 Chat: ${chat.chat_title}
🆔 Chat ID: ${chat.chat_id}
📂 Type: ${chat.chat_type}
🟢 Status: Connected
━━━━━━━━━━━━━━━━━━━━
You can now connect your backend.`
        );

    });

}