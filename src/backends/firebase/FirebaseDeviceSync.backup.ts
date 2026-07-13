import { DeviceRepository } from "../../database/repositories/DeviceRepository";

export class FirebaseDeviceSync {

    static sync(
        backendId: number,
        users: Record<string, any>
    ) {

        if (!users) {
            return 0;
        }

        let total = 0;

        for (const [deviceKey, d] of Object.entries(users)) {

            const battery =
                Number(
                    String(d?.battery ?? "0")
                        .replace("%", "")
                );

            const simCount =
                d?.sim2_number ? 2 : 1;

            const activeSim =
                Number(d?.active_sim ?? 1);

            DeviceRepository.upsert({

                backendId,

                deviceId:
                    d?.device_id ??
                    deviceKey,

                deviceName:
                    d?.model ??
                    "Unknown Device",

                note:
                    d?.note,

                manufacturer:
                    d?.manufacturer,

                brand:
                    d?.brand,

                model:
                    d?.model,

                androidVersion:
                    d?.android_version,

                phoneNumber:
                    activeSim === 2
                        ? d?.sim2_number
                        : d?.sim1_number,

                sim1Number:
                    d?.sim1_number,

                sim1Carrier:
                    d?.sim1_carrier,

                sim2Number:
                    d?.sim2_number,

                sim2Carrier:
                    d?.sim2_carrier,

                activeSim,

                battery,

                simCount,

                networkType:
                    d?.network_type,

                status:
                    d?.online
                        ? "online"
                        : "offline",

                lastSeen:
                    d?.last_seen
                        ? new Date(
                              Number(d.last_seen)
                          ).toISOString()
                        : undefined

            });

            total++;

        }

        return total;

    }

}