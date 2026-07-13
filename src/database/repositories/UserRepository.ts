import { db } from "../database";
import { UserState } from "../../enums/UserState";

export class UserRepository {

    static findByTelegramId(
        telegramId: number
    ) {

        return db.prepare(`
            SELECT *

            FROM users

            WHERE telegram_id = ?

            LIMIT 1
        `).get(telegramId);

    }


    static exists(
        telegramId: number
    ): boolean {

        return !!this.findByTelegramId(
            telegramId
        );

    }



    static create(user: {

        telegramId: number;

        username?: string;

        firstName?: string;

        lastName?: string;

        licenseId?: number | null;

        state: UserState;

    }) {

        return db.prepare(`
            INSERT INTO users (

                telegram_id,

                username,

                first_name,

                last_name,

                license_id,

                state

            )

            VALUES (?, ?, ?, ?, ?, ?)

        `).run(

            user.telegramId,

            user.username ?? null,

            user.firstName ?? null,

            user.lastName ?? null,

            user.licenseId ?? null,

            user.state

        );

    }



    static updateState(
        telegramId: number,
        state: UserState
    ) {

        return db.prepare(`
            UPDATE users

            SET

                state = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE telegram_id = ?

        `).run(

            state,

            telegramId

        );

    }




    static updateLicense(
        telegramId: number,
        licenseId: number
    ) {

        return db.prepare(`
            UPDATE users

            SET

                license_id = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE telegram_id = ?

        `).run(

            licenseId,

            telegramId

        );

    }




    static getSmsApiKey(
        telegramId: number
    ) {

        const user:any =
            db.prepare(`
                SELECT sms_api_key

                FROM users

                WHERE telegram_id = ?

                LIMIT 1

            `).get(
                telegramId
            );


        return user?.sms_api_key || null;

    }




    static setSmsApiKey(
        telegramId:number,
        key:string
    ) {

        return db.prepare(`
            UPDATE users

            SET

                sms_api_key = ?,

                updated_at = CURRENT_TIMESTAMP

            WHERE telegram_id = ?

        `).run(

            key,

            telegramId

        );

    }




    static delete(
        telegramId: number
    ) {

        return db.prepare(`
            DELETE

            FROM users

            WHERE telegram_id = ?

        `).run(

            telegramId

        );

    }




    static count() {

        return db.prepare(`
            SELECT COUNT(*) AS total

            FROM users

        `).get();

    }




    static all() {

        return db.prepare(`
            SELECT *

            FROM users

            ORDER BY created_at DESC

        `).all();

    }

}