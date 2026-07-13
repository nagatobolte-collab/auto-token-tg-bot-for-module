import { Telegraf } from "telegraf";

import { TelegramParserService } from "../services/parser/TelegramParserService";
import { SmsQueueService } from "../services/sms/SmsQueueService";

import { MonitorChatRepository } from "../database/repositories/MonitorChatRepository";
import { MonitoringRepository } from "../database/repositories/MonitoringRepository";
import { VerificationRepository } from "../database/repositories/VerificationRepository";
import { UserRepository } from "../database/repositories/UserRepository";

import { UserState } from "../enums/UserState";

import { logger } from "../logger/logger";


export function registerGroupMessageHandler(
    bot: Telegraf
) {


    bot.on("text", async (ctx, next) => {


        console.log("========== UPDATE ==========");
        console.log("CHAT TYPE:", ctx.chat.type);
        console.log("CHAT ID:", ctx.chat.id);
        console.log("TEXT:", ctx.message.text);
        console.log("============================");



        // Ignore private chats

        if (ctx.chat.type === "private") {

            return next();

        }



        const text =
            ctx.message.text.trim();




        // ==========================================================
        // VERIFY CHAT
        // ==========================================================


        if (text.startsWith("VERIFY-")) {


            const verification: any =
                VerificationRepository.findByCode(text);



            if (!verification) {

                return next();

            }



            if (
                verification.expires_at <
                Date.now()
            ) {


                await ctx.reply(
                    "❌ Verification code expired.\nGenerate a new one using /verifychat."
                );


                VerificationRepository.delete(
                    verification.telegram_id
                );


                return;

            }




            const exists =
                MonitorChatRepository.findByChatId(
                    String(ctx.chat.id)
                );



            if (!exists) {


                MonitorChatRepository.create(

                    verification.telegram_id,

                    String(ctx.chat.id),

                    ctx.chat.title ?? "Unknown",

                    ctx.chat.type

                );

            }



            UserRepository.updateState(

                verification.telegram_id,

                UserState.WAITING_BACKEND

            );



            VerificationRepository.delete(

                verification.telegram_id

            );



            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ Chat Verified

📢 Chat
${ctx.chat.title ?? "Unknown"}

💬 Type
${ctx.chat.type}

🚀 Verification completed.

Return to bot and use

/addbackend

━━━━━━━━━━━━━━━━━━━━`
            );


            return;

        }





        // ==========================================================
        // MONITORING CHECK
        // ==========================================================


        const chat =
            MonitorChatRepository.findByChatId(
                String(ctx.chat.id)
            );


        if (!chat) {

            return next();

        }





        const monitoring: any =
            MonitoringRepository.findByTelegramId(
                chat.telegram_id
            );


        console.log(
            "MONITORING SESSION:",
            monitoring
        );



        if (!monitoring) {

            return next();

        }






        // ==========================================================
        // IGNORE OLD MESSAGES
        // ==========================================================


        const messageTime =
            ctx.message.date * 1000;



        const startedTime =
            new Date(
                monitoring.started_at
            ).getTime();



        if (
            messageTime <
            startedTime
        ) {


            logger.info(
                "Ignored old message before monitoring started"
            );


            return next();

        }





        // ==========================================================
        // PARSE MESSAGE
        // ==========================================================


        const parsed =
            TelegramParserService.parse(
                text
            );


        console.log(
            "PARSED RESULT:",
            parsed
        );



        if (!parsed.success) {

            return next();

        }






        // ==========================================================
        // QUEUE SMS
        // ==========================================================


        const queued =
            SmsQueueService.enqueue({

                telegramId:
                    monitoring.telegram_id,


                backendId:
                    monitoring.backend_id,


                deviceId:
                    monitoring.device_id,


                phoneNumber:
                    parsed.phoneNumber!,


                message:
                    parsed.message!,


                simSlot:
                    monitoring.sim_slot,


                hash:
                    parsed.hash!

            });





        console.log(
            "QUEUE RESULT:",
            queued
        );




        if (!queued.success) {


            logger.warn(
                queued.message
            );


            return next();

        }





        logger.info(
            `Queued SMS -> ${parsed.phoneNumber}`
        );



        return next();


    });


}