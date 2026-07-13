import { Telegraf } from "telegraf";

import { DeviceRepository } from "../../database/repositories/DeviceRepository";
import { SessionRepository } from "../../database/repositories/SessionRepository";

import { deviceKeyboard } from "../../keyboards/deviceKeyboard";

export function registerFindDeviceCommand(bot: Telegraf) {

    bot.command("finddevice", async (ctx) => {

        if (!ctx.from) {
            return;
        }

        const args =
            ctx.message.text.trim().split(/\s+/);

        if (args.length !== 2) {

            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
📱 Find Device
Usage
/finddevice <device_id>
Example
/finddevice 017cef4b4b5a8667
━━━━━━━━━━━━━━━━━━━━`
            );

            return;

        }

        const deviceId =
            args[1].trim();

        const device =
            DeviceRepository.findByTelegramAndDeviceId(

                ctx.from.id,

                deviceId

            );

        if (!device) {

            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
❌ Device Not Found

Please check:
• Device ID is correct
• Backend is connected
• Device belongs to your account
• Device has synchronized
━━━━━━━━━━━━━━━━━━━━`
            );

            return;

        }

        // =====================================================
        // Save Current Session
        // =====================================================

        SessionRepository.create({

            telegramId:
                ctx.from.id,

            backendId:
                device.backend_id,

            deviceId:
                device.device_id,

            simSlot:
                device.active_sim ?? 1

        });

        const online =
            device.status === "online"
                ? "🟢 Online"
                : "🔴 Offline";

        const activeSim =
            device.active_sim ?? 1;

        const activeNumber =
            activeSim === 2
                ? (
                    device.sim2_number ??
                    "Unknown"
                )
                : (
                    device.sim1_number ??
                    "Unknown"
                );

        await ctx.reply(

`━━━━━━━━━━━━━━━━━━━━
✅ Device Selected
📱 Device
${device.model || device.device_name}
${online}
🔋 Battery
${device.battery}%
📶 Active SIM
SIM ${activeSim}
📞 Active Number
${activeNumber}
🕒 Last Seen
${device.last_seen ?? "Unknown"}
━━━━━━━━━━━━━━━━━━━━
Select the SIM you want
to use for monitoring.
━━━━━━━━━━━━━━━━━━━━`,

            deviceKeyboard(

                device.sim1_carrier,

                device.sim2_carrier

            )

        );

    });

}