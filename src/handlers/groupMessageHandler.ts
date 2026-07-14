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


    async function handleMessage(
        ctx: any,
        next: any
    ) {


        const chatType =
            ctx.chat?.type;


        const text =
            ctx.message?.text ||
            ctx.channelPost?.text ||
            "";


        if (!text) {

            return next();

        }



        console.log("========== UPDATE ==========");
        console.log("CHAT TYPE:", chatType);
        console.log("CHAT ID:", ctx.chat.id);
        console.log("TEXT:", text);
        console.log("============================");



        // Ignore private messages

        if (
            chatType === "private"
        ) {

            return next();

        }




        // ======================================================
        // VERIFY CHAT / CHANNEL
        // ======================================================


        if (
            text.startsWith("VERIFY-")
        ) {


            const verification:any =
                VerificationRepository.findByCode(
                    text
                );


            if (!verification) {

                return next();

            }



            if (
                verification.expires_at <
                Date.now()
            ) {


                await ctx.reply(
`❌ Verification expired.
Generate a new code using /verifychat`
                );


                VerificationRepository.delete(
                    verification.telegram_id
                );


                return;

            }




            const existing =
                MonitorChatRepository.findByChatId(
                    String(ctx.chat.id)
                );



            if (!existing) {


                MonitorChatRepository.create(

                    verification.telegram_id,

                    String(ctx.chat.id),

                    ctx.chat.title ??
                    "Unknown",

                    chatType

                );


            }




            UserRepository.updateState(

                verification.telegram_id,

                UserState.WAITING_BACKEND

            );



            VerificationRepository.delete(

                verification.telegram_id

            );




            await ctx.telegram.sendMessage(
                String(ctx.chat.id),
`✅ Chat Verified
📢 ${ctx.chat.title ?? "Unknown"}
💬 Type: ${chatType}
🚀 Monitoring source connected.
Return to bot and continue setup.`
            );



            return;

        }





        // ======================================================
        // FIND VERIFIED CHAT
        // ======================================================


        const chat =
            MonitorChatRepository.findByChatId(
                String(ctx.chat.id)
            );



        if (!chat) {

            return next();

        }





        // ======================================================
        // ACTIVE MONITORING CHECK
        // ======================================================


        const monitoring:any =
            MonitoringRepository.findByTelegramId(
                chat.telegram_id
            );



        if (!monitoring) {

            return next();

        }





        // ======================================================
        // IGNORE OLD MESSAGES
        // ======================================================


        const messageDate =
            (
                ctx.message?.date ||
                ctx.channelPost?.date
            ) * 1000;



        const monitorStarted =
            new Date(
                monitoring.started_at
            ).getTime();



        if (
            messageDate &&
            messageDate < monitorStarted
        ) {


            logger.info(
                "Ignoring old message before monitoring start"
            );


            return next();

        }





        // ======================================================
        // PARSE SMS MESSAGE
        // ======================================================


        const parsed =
            TelegramParserService.parse(
                text
            );



        console.log(
            "PARSED:",
            parsed
        );



        if (
            !parsed.success
        ) {

            return next();

        }







        // ======================================================
        // QUEUE SMS
        // ======================================================


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






        if (
            !queued.success
        ) {


            logger.warn(
                queued.message
            );


            return next();

        }





        logger.info(
            `SMS queued -> ${parsed.phoneNumber}`
        );



        return next();

    }





    // Group + Supergroup

    bot.on(
        "text",
        handleMessage
    );



    // Channel posts

    bot.on(
        "channel_post",
        handleMessage
    );


}