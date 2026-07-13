import { Telegraf } from "telegraf";

import { SessionRepository } from "../database/repositories/SessionRepository";

export function registerDeviceCallbacks(bot: Telegraf) {

    bot.action("device_sim_1", async (ctx) => {

        await ctx.answerCbQuery();

        if (!ctx.from) return;

        SessionRepository.updateSim(
            ctx.from.id,
            1
        );

        await ctx.reply(
`✅ SIM Selected

📶 Active SIM

SIM 1

You can now use this device.`
        );

    });

    bot.action("device_sim_2", async (ctx) => {

        await ctx.answerCbQuery();

        if (!ctx.from) return;

        SessionRepository.updateSim(
            ctx.from.id,
            2
        );

        await ctx.reply(
`✅ SIM Selected

📶 Active SIM

SIM 2

You can now use this device.`
        );

    });

}