import { FirebaseService } from "./FirebaseService";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";

export class FirebaseUrlProvider {

    static async import(
        telegramId: number,
        databaseUrl: string
    ) {

        if (!databaseUrl) {

            return {
                success: false,
                message: "Invalid Firebase URL."
            };

        }

        const serviceAccount = {
            project_id: databaseUrl
                .replace("https://", "")
                .replace("-default-rtdb.firebaseio.com", "")
                .replace(".firebaseio.com", "")
        };

        const healthy =
            await FirebaseService.healthCheck(serviceAccount);

        if (!healthy) {

            return {
                success: false,
                message: "Unable to connect to Firebase."
            };

        }

        const backend =
            BackendRepository.create({

                telegramId,

                backendType: "firebase_url",

                backendIdentifier: databaseUrl,

                config: databaseUrl

            });

        const totalDevices =
            await FirebaseDeviceSync.sync(

                Number(backend.lastInsertRowid),

                serviceAccount

            );

        return {

            success: true,

            backendIdentifier: databaseUrl,

            totalDevices

        };

    }

}