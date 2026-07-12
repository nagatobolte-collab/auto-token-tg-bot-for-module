import { Telegraf } from "telegraf";

export function registerSetupCallbacks(bot: Telegraf) {

    bot.action("verify_group", async (ctx) => {

        await ctx.answerCbQuery();

        const chat = ctx.chat;

        if (!chat || chat.type === "private") {

            await ctx.reply(
`❌ No monitoring group found.

Please:
1️⃣ Add this bot to your Telegram group.
2️⃣ Make it Admin.
3️⃣ Return here and press Verify Group again.`
            );

            return;
        }

        await ctx.reply(
`✅ Group detected.

Name:
${chat.title}
ID:
${chat.id}
(Temporary success)
Next step:
Connect your backend.`
        );

    });

}