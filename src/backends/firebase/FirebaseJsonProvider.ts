import { FirebaseRestClient } from "./FirebaseRestClient";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";

export class FirebaseJsonProvider {

    static async import(
        telegramId: number,
        json: any
    ) {

        // ==========================================================
        // Validate Firebase JSON
        // ==========================================================

        if (
            !json.project_id ||
            !json.database_url
        ) {

            return {

                success: false,

                message:
                    "Invalid Firebase Service Account."

            };

        }

        try {

            // ======================================================
            // Save Backend
            // ======================================================

            const backend =
                BackendRepository.create({

                    telegramId,

                    backendType:
                        "firebase_json",

                    backendIdentifier:
                        json.project_id,

                    config:
                        JSON.stringify(json)

                });

            // ======================================================
            // Verify Firebase
            // ======================================================

            const serviceAccount =
                await FirebaseRestClient.getUsers(
                    json.database_url
                );

            // ======================================================
            // Sync Devices
            // ======================================================

            const totalDevices =
                await FirebaseDeviceSync.sync(

                    Number(
                        backend.lastInsertRowid
                    ),

                    serviceAccount

                );

            return {

                success: true,

                backendIdentifier:
                    json.project_id,

                totalDevices

            };

        } catch (error) {

            console.error(error);

            return {

                success: false,

                message:
                    "Unable to connect to Firebase."

            };

        }

    }

}