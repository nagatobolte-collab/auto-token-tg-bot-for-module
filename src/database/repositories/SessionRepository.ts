import { db } from "../database";

export class SessionRepository {

    // Create or replace session
    static create(data: {

        telegramId: number;

        backendId: number;

        deviceId: string;

        simSlot?: number;

    }) {

        db.prepare(`
            DELETE
            FROM sessions
            WHERE telegram_id = ?
        `).run(data.telegramId);

        return db.prepare(`
            INSERT INTO sessions (

                telegram_id,

                backend_id,

                device_id,

                sim_slot,

                started_at

            )
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(

            data.telegramId,

            data.backendId,

            data.deviceId,

            data.simSlot ?? null

        );

    }

    // Current selected session
    static find(
        telegramId: number
    ) {

        return db.prepare(`
            SELECT *
            FROM sessions
            WHERE telegram_id = ?
            LIMIT 1
        `).get(telegramId);

    }

    // Change selected device
    static updateDevice(
        telegramId: number,
        backendId: number,
        deviceId: string
    ) {

        return db.prepare(`
            UPDATE sessions

            SET

                backend_id = ?,

                device_id = ?,

                sim_slot = NULL

            WHERE telegram_id = ?
        `).run(

            backendId,

            deviceId,

            telegramId

        );

    }

    // User selected SIM
    static updateSim(
        telegramId: number,
        simSlot: number
    ) {

        return db.prepare(`
            UPDATE sessions

            SET sim_slot = ?

            WHERE telegram_id = ?
        `).run(

            simSlot,

            telegramId

        );

    }

    // Ready to start monitoring?
    static hasCompleteSession(
        telegramId: number
    ): boolean {

        const row: any = db.prepare(`
            SELECT COUNT(*) total

            FROM sessions

            WHERE

                telegram_id = ?

                AND backend_id IS NOT NULL

                AND device_id IS NOT NULL

                AND sim_slot IS NOT NULL
        `).get(telegramId);

        return row.total > 0;

    }

    // Clear current session
    static clear(
        telegramId: number
    ) {

        return db.prepare(`
            DELETE
            FROM sessions
            WHERE telegram_id = ?
        `).run(telegramId);

    }

}