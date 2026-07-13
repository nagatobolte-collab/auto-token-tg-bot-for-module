import { db } from "../database";
import { Device } from "../../types/Device";

export class DeviceRepository {


    private static upsertQuery = db.prepare(`

        INSERT INTO devices (

            backend_id,

            device_id,

            device_name,

            note,

            manufacturer,

            brand,

            model,

            android_version,

            phone_number,

            sim1_number,

            sim1_carrier,

            sim2_number,

            sim2_carrier,

            active_sim,

            battery,

            sim_count,

            network_type,

            status,

            last_seen

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON CONFLICT(backend_id, device_id)

        DO UPDATE SET

            device_name = excluded.device_name,

            note = excluded.note,

            manufacturer = excluded.manufacturer,

            brand = excluded.brand,

            model = excluded.model,

            android_version = excluded.android_version,

            phone_number = excluded.phone_number,

            sim1_number = excluded.sim1_number,

            sim1_carrier = excluded.sim1_carrier,

            sim2_number = excluded.sim2_number,

            sim2_carrier = excluded.sim2_carrier,

            active_sim = excluded.active_sim,

            battery = excluded.battery,

            sim_count = excluded.sim_count,

            network_type = excluded.network_type,

            status = excluded.status,

            last_seen = excluded.last_seen

    `);



    static upsert(
        device: Device
    ) {

        return this.upsertQuery.run(

            device.backendId,

            device.deviceId,

            device.deviceName,

            device.note ?? null,

            device.manufacturer ?? null,

            device.brand ?? null,

            device.model ?? null,

            device.androidVersion ?? null,

            device.phoneNumber ?? null,

            device.sim1Number ?? null,

            device.sim1Carrier ?? null,

            device.sim2Number ?? null,

            device.sim2Carrier ?? null,

            device.activeSim ?? 1,

            device.battery,

            device.simCount,

            device.networkType ?? null,

            device.status,

            device.lastSeen ?? null

        );

    }



    // FAST BULK SYNC FOR THOUSANDS OF DEVICES

    static bulkUpsert(
        devices: Device[]
    ) {

        const transaction =
            db.transaction(
                (items: Device[]) => {

                    for (
                        const device of items
                    ) {

                        this.upsert(
                            device
                        );

                    }

                }
            );


        transaction(
            devices
        );


        return devices.length;

    }




    static find(
        deviceId: string
    ) {

        return db.prepare(`
            SELECT *
            FROM devices
            WHERE device_id = ?
            LIMIT 1
        `).get(deviceId);

    }



    static exists(
        telegramId:number,
        deviceId:string
    ):boolean {


        const row:any =
            db.prepare(`

                SELECT COUNT(*) AS total

                FROM devices d

                INNER JOIN backends b

                ON b.id = d.backend_id

                WHERE

                b.telegram_id = ?

                AND

                d.device_id = ?

            `).get(

                telegramId,

                deviceId

            );


        return row.total > 0;

    }




    static findByBackend(
        backendId:number
    ){

        return db.prepare(`
            SELECT *
            FROM devices
            WHERE backend_id = ?
            ORDER BY model
        `).all(
            backendId
        );

    }





    static findByTelegram(
        telegramId:number
    ){

        return db.prepare(`

            SELECT d.*

            FROM devices d

            INNER JOIN backends b

            ON b.id = d.backend_id

            WHERE

            b.telegram_id = ?

            ORDER BY

            d.status DESC,

            d.model ASC

        `).all(
            telegramId
        );

    }




    static findByTelegramAndDeviceId(
        telegramId:number,
        deviceId:string
    ){

        return db.prepare(`

            SELECT

            d.*,

            b.id AS backend_id,

            b.backend_type,

            b.backend_identifier,

            b.status AS backend_status

            FROM devices d

            INNER JOIN backends b

            ON b.id = d.backend_id

            WHERE

            b.telegram_id = ?

            AND

            d.device_id = ?

            LIMIT 1

        `).get(

            telegramId,

            deviceId

        );

    }





    static updateStatus(
        backendId:number,
        deviceId:string,
        status:string
    ){

        return db.prepare(`

            UPDATE devices

            SET

            status = ?,

            last_seen = CURRENT_TIMESTAMP

            WHERE

            backend_id = ?

            AND

            device_id = ?

        `).run(

            status,

            backendId,

            deviceId

        );

    }





    static deleteByBackend(
        backendId:number
    ){

        return db.prepare(`

            DELETE

            FROM devices

            WHERE backend_id = ?

        `).run(
            backendId
        );

    }





    static countByBackend(
        backendId:number
    ){

        return db.prepare(`

            SELECT COUNT(*) AS total

            FROM devices

            WHERE backend_id = ?

        `).get(
            backendId
        );

    }

}
