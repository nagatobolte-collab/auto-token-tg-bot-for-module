import { Telegraf } from "telegraf";
import { DeviceRepository } from "../../database/repositories/DeviceRepository";

export function registerFindDeviceCommand(bot: Telegraf) {

    bot.command("finddevice", async (ctx) => {

        if (!ctx.from) return;

        const args = ctx.message.text.trim().split(/\s+/);

        if (args.length !== 2) {

            await ctx.reply(
`Usage

/finddevice <device_id>

Example

/finddevice 017cef4b4b5a8667`
            );

            return;

        }

        const deviceId = args[1];

        const device =
            DeviceRepository.findByTelegramAndDeviceId(
                ctx.from.id,
                deviceId
            );

        if (!device) {

            await ctx.reply(
`❌ Device not found.

Make sure:

• Device ID is correct
• Device belongs to your account
• Device has been synchronized`
            );

            return;

        }

        const online =
            device.status === "online"
                ? "🟢 Online"
                : "🔴 Offline";

        await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ SUCCESS
Device Set!
📱 ${device.model || device.device_name}
${online}
🔋 Battery: ${device.battery}%
🕒 Last Seen
${device.last_seen ?? "Unknown"}
━━━━━━━━━━━━━━━━━━━━
Select SIM Slot:`
        );

    });

}