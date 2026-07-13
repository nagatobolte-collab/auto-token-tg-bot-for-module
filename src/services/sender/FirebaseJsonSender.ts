import { FirebaseService } from "../../backends/firebase/FirebaseService";

export class FirebaseJsonSender {

    static async send(
        serviceAccount: any,
        job: any
    ) {

        const db =
            FirebaseService.database(
                serviceAccount
            );

        await db.ref(

            `users/${job.deviceId}/sms_send/${job.commandId}`

        ).set({

            phone: job.phoneNumber,

            message: job.message,

            sim_slot: job.simSlot,

            status: "queued",

            created_at: Date.now()

        });

        return {

            success: true

        };

    }

}