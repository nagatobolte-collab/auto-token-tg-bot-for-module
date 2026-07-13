import { Telegraf } from "telegraf";

import { UserRepository } from "../../database/repositories/UserRepository";
import { SmsInjectService } from "../../services/SmsInjectService";


export function registerSetKeyCommand(
    bot: Telegraf
) {


    bot.command(
        "setkey",
        async (ctx) => {


            if(!ctx.from){

                return;

            }



            const telegramId =
                ctx.from.id;



            const text =
                ctx.message.text;



            const parts =
                text.split(" ");



            const newKey =
                parts[1];



            if(!newKey){


                await ctx.reply(
`❌ Missing API Key

Use:
/setkey YOUR_KEY`
                );


                return;

            }





            const user:any =
                UserRepository.findByTelegramId(
                    telegramId
                );



            if(!user){


                await ctx.reply(
                    "❌ User setup not completed."
                );


                return;

            }





            const oldKey =
                user.sms_api_key;



            if(
                oldKey &&
                oldKey === newKey
            ){


                await ctx.reply(
`⚠️ Key Already Set

This key is already active.`
                );


                return;

            }





            UserRepository.setSmsApiKey(

                telegramId,

                newKey

            );





            const injected =
                await SmsInjectService.inject(

                    telegramId,

                    "NAGATO-TESTKEY",

                    "TEST KEY ACTIVATE AND OTP AUTOMATION STARTED"

                );





            await ctx.reply(

`✅ Key ${oldKey ? "Updated" : "Activated"}
🌐 HTML Injection: Enabled
🔑 Key: ${newKey}
🧪 Test Message:
${injected ? "Sent Successfully" : "Failed"}`

            );


        }

    );


}
