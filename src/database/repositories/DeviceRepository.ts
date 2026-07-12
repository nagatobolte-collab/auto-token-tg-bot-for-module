import { db } from "../database";
import { Device } from "../../types/Device";

export class DeviceRepository {

    static upsert(device: Device) {

        return db.prepare(`
            INSERT INTO devices (

                backend_id,
                device_id,
                device_name,
                phone_number,
                model,
                android_version,
                battery,
                sim_count,
                status,
                last_seen

            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            ON CONFLICT(backend_id, device_id)

            DO UPDATE SET

                device_name = excluded.device_name,
                phone_number = excluded.phone_number,
                model = excluded.model,
                android_version = excluded.android_version,
                battery = excluded.battery,
                sim_count = excluded.sim_count,
                status = excluded.status,
                last_seen = excluded.last_seen

        `).run(

            device.backendId,
            device.deviceId,
            device.deviceName,
            device.phoneNumber ?? null,
            device.model ?? null,
            device.androidVersion ?? null,
            device.battery,
            device.simCount,
            device.status,
            device.lastSeen ?? null

        );

    }

    static findByBackend(backendId: number) {

        return db.prepare(`
            SELECT *
            FROM devices
            WHERE backend_id = ?
            ORDER BY model
        `).all(backendId);

    }

    static find(deviceId: string) {

        return db.prepare(`
            SELECT *
            FROM devices
            WHERE device_id = ?
            LIMIT 1
        `).get(deviceId);

    }

    static findByTelegram(telegramId: number) {

        return db.prepare(`
            SELECT
                d.*
            FROM devices d

            INNER JOIN backends b
                ON b.id = d.backend_id

            WHERE
                b.telegram_id = ?

            ORDER BY
                d.status DESC,
                d.model ASC
        `).all(telegramId);

    }

    static findByTelegramAndDeviceId(
        telegramId: number,
        deviceId: string
    ) {

        return db.prepare(`
            SELECT
                d.*
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

    static deleteByBackend(
        backendId: number
    ) {

        return db.prepare(`
            DELETE
            FROM devices
            WHERE backend_id = ?
        `).run(backendId);

    }

    static countByBackend(
        backendId: number
    ) {

        return db.prepare(`
            SELECT COUNT(*) AS total
            FROM devices
            WHERE backend_id = ?
        `).get(backendId);

    }

}