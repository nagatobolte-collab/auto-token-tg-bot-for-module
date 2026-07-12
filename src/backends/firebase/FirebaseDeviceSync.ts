import { FirebaseService } from "./FirebaseService";
import { DeviceRepository } from "../../database/repositories/DeviceRepository";

export class FirebaseDeviceSync {

    static async sync(
        backendId: number,
        serviceAccount: any
    ) {

        const db =
            FirebaseService.database(serviceAccount);

        const snapshot =
            await db.ref("users").once("value");

        if (!snapshot.exists()) {

            return 0;

        }

        let total = 0;

        snapshot.forEach(deviceSnapshot => {

            const d: any = deviceSnapshot.val();

            DeviceRepository.upsert({

                backendId,

                deviceId:
                    d.device_id ??
                    deviceSnapshot.key,

                deviceName:
                    d.note ??
                    d.model ??
                    "Unknown Device",

                phoneNumber:
                    d.sim1_number ?? "",

                model:
                    d.model ?? "",

                androidVersion:
                    d.android_version ?? "",

                battery:
                    Number(
                        String(d.battery ?? "0")
                            .replace("%", "")
                    ),

                simCount:
                    d.sim2_number ? 2 : 1,

                status:
                    d.online
                        ? "online"
                        : "offline",

                lastSeen:
                    d.last_seen
                        ? new Date(
                              Number(d.last_seen)
                          ).toISOString()
                        : undefined

            });

            total++;

        });

        return total;

    }

}