import { FirebaseService } from "./FirebaseService";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";

export class FirebaseJsonProvider {

    static async import(
        telegramId: number,
        json: any
    ) {

        if (!json.project_id) {

            return {
                success: false,
                message: "Invalid Firebase JSON."
            };

        }

        const healthy =
            await FirebaseService.healthCheck(json);

        if (!healthy) {

            return {
                success: false,
                message: "Unable to connect to Firebase."
            };

        }

        const backend =
            BackendRepository.create({

                telegramId,

                backendType: "firebase_json",

                backendIdentifier: json.project_id,

                config: JSON.stringify(json)

            });

        const totalDevices =
            await FirebaseDeviceSync.sync(

                Number(backend.lastInsertRowid),

                json

            );

        return {

            success: true,

            backendIdentifier: json.project_id,

            totalDevices

        };

    }

}