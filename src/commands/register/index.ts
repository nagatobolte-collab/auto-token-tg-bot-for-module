import { Telegraf } from "telegraf";

import { MonitorGroupRepository } from "../../database/repositories/MonitorGroupRepository";
import { UserRepository } from "../../database/repositories/UserRepository";

import { UserState } from "../../enums/UserState";

import { backendKeyboard } from "../../keyboards/backendKeyboard";

export function registerGroupCommand(bot: Telegraf) {

    bot.command("register", async (ctx) => {

        if (ctx.chat.type === "private") {

            await ctx.reply(
`❌

Use this command inside your monitoring group.

Example

/register`
            );

            return;
        }

        const exists =
            MonitorGroupRepository.findByGroupId(
                String(ctx.chat.id)
            );

        if (exists) {

            await ctx.reply(
                "✅ This group is already registered."
            );

            return;
        }

        // Save the group
        MonitorGroupRepository.create(
            ctx.from.id,
            String(ctx.chat.id),
            ctx.chat.title ?? "Unknown"
        );

        // Update user state
        UserRepository.updateState(
            ctx.from.id,
            UserState.WAITING_BACKEND
        );

        // Ask user to connect backend
        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ Monitoring Group Connected
📢 Group

${ctx.chat.title}
━━━━━━━━━━━━━━━━━━━━
Choose your first backend.`,
            backendKeyboard
        );

    });

}