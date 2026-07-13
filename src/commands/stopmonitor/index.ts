import { Telegraf } from "telegraf";

import { MonitoringRepository } from "../../database/repositories/MonitoringRepository";
import { MonitoringService } from "../../services/MonitoringService";
import { DeviceRepository } from "../../database/repositories/DeviceRepository";
import { MonitorChatRepository } from "../../database/repositories/MonitorChatRepository";

export function registerStopMonitorCommand(
    bot: Telegraf
) {

    bot.command(
        "stopmonitor",
        async (ctx) => {

            if (!ctx.from) {
                return;
            }

            const running =
                MonitoringRepository.findByTelegramId(
                    ctx.from.id
                );

            if (!running) {

                await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ No Active Monitoring
There isn't an active
monitoring session.
Use
/startmonitor
━━━━━━━━━━━━━━━━━━━━`
                );

                return;

            }

            const device =
                DeviceRepository.findByTelegramAndDeviceId(

                    ctx.from.id,

                    running.device_id

                );

            const chat =
                MonitorChatRepository.findByTelegramId(
                    ctx.from.id
                );

            MonitoringService.stop(

                ctx.from.id,

                "manual"

            );

            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
🛑 Monitoring Stopped
📱 Device: ${device?.model || device?.device_name || running.device_id}
📢 Chat: ${chat?.chat_title || "Unknown"}
📝 Reason: Stopped by user.
━━━━━━━━━━━━━━━━━━━━
Monitoring has ended.
━━━━━━━━━━━━━━━━━━━━`
            );

        }
    );

}