import { db } from "../database";

export class MonitoringRepository {


    // Start monitoring
    static start(data: {

        telegramId: number;

        backendId: number;

        deviceId: string;

        simSlot: number;

        chatId: string;

        expiresAt: string;

    }) {


        console.log(
            "INSERTING MONITOR SESSION:",
            data
        );


        try {


            db.prepare(`
                DELETE FROM monitoring_sessions
                WHERE telegram_id = ?
            `).run(
                data.telegramId
            );



            const result =
                db.prepare(`
                    INSERT INTO monitoring_sessions (

                        telegram_id,

                        backend_id,

                        device_id,

                        sim_slot,

                        chat_id,

                        status,

                        expires_at

                    )

                    VALUES (?, ?, ?, ?, ?, 'running', ?)

                `).run(

                    data.telegramId,

                    data.backendId,

                    data.deviceId,

                    data.simSlot,

                    data.chatId,

                    data.expiresAt

                );


            console.log(
                "MONITOR SESSION CREATED:",
                result
            );


            return result;


        } catch (error) {


            console.error(
                "MONITOR SESSION INSERT FAILED:",
                error
            );


            throw error;


        }

    }




    static findByTelegramId(
        telegramId: number
    ) {

        return db.prepare(`
            SELECT *

            FROM monitoring_sessions

            WHERE telegram_id = ?

            LIMIT 1

        `).get(
            telegramId
        );

    }




    static findByDeviceId(
        deviceId: string
    ) {

        return db.prepare(`
            SELECT *

            FROM monitoring_sessions

            WHERE device_id = ?

            LIMIT 1

        `).get(
            deviceId
        );

    }




    static findRunning() {

        return db.prepare(`
            SELECT *

            FROM monitoring_sessions

            WHERE status = 'running'

            ORDER BY started_at ASC

        `).all();

    }




    static isMonitoring(
        telegramId: number
    ): boolean {


        const row:any = db.prepare(`
            SELECT COUNT(*) total

            FROM monitoring_sessions

            WHERE telegram_id = ?

            AND status = 'running'

        `).get(
            telegramId
        );


        return row.total > 0;

    }




    static remainingTime(
        telegramId:number
    ){

        return db.prepare(`
            SELECT expires_at

            FROM monitoring_sessions

            WHERE telegram_id = ?

            LIMIT 1

        `).get(
            telegramId
        );

    }




    static markWarningSent(
        telegramId:number
    ){

        return db.prepare(`
            UPDATE monitoring_sessions

            SET warning_sent = 1

            WHERE telegram_id = ?

        `).run(
            telegramId
        );

    }




    static stop(
        telegramId:number,
        reason:string
    ){

        return db.prepare(`
            UPDATE monitoring_sessions

            SET

                status='stopped',

                stopped_reason=?,

                stopped_at=CURRENT_TIMESTAMP


            WHERE telegram_id=?

        `).run(

            reason,

            telegramId

        );

    }




    static remove(
        telegramId:number
    ){

        return db.prepare(`
            DELETE

            FROM monitoring_sessions

            WHERE telegram_id=?

        `).run(
            telegramId
        );

    }

}