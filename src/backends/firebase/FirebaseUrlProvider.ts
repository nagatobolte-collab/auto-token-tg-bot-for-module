import { FirebaseService } from "./FirebaseService";
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

        BackendRepository.create({

            telegramId,

            backendType: "firebase_json",

            backendIdentifier: json.project_id,

            config: JSON.stringify(json)

        });

        return {

            success: true,

            backendIdentifier: json.project_id

        };

    }

}