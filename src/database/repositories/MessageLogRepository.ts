import { db } from "../database";

export class MessageLogRepository {

    static insert(data: {
        telegramId: number;
        backendId: number;
        deviceId: string;
        deviceModel?: string;
        phoneNumber?: string;
        message: string;
        receivedAt: string;
    }) {

        return db.prepare(`
            INSERT INTO message_logs (

                telegram_id,

                backend_id,

                device_id,

                device_model,

                phone_number,

                message,

                received_at

            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(

            data.telegramId,

            data.backendId,

            data.deviceId,

            data.deviceModel ?? null,

            data.phoneNumber ?? null,

            data.message,

            data.receivedAt

        );

    }

    static searchLast24Hours(keyword: string) {

        return db.prepare(`
            SELECT *

            FROM message_logs

            WHERE

                LOWER(message)

                LIKE LOWER(?)

            AND

                received_at >= datetime(
                    'now',
                    '-24 hours'
                )

            ORDER BY received_at DESC
        `).all(`%${keyword}%`);

    }

    static deleteOlderThan24Hours() {

        return db.prepare(`
            DELETE

            FROM message_logs

            WHERE

                received_at < datetime(
                    'now',
                    '-24 hours'
                )
        `).run();

    }

    static countToday() {

        return db.prepare(`
            SELECT COUNT(*) total

            FROM message_logs

            WHERE

                date(received_at)

                = date('now')
        `).get();

    }

}