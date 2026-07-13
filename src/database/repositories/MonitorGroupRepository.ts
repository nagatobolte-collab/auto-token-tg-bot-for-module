import { db } from "../database";

export class MonitorChatRepository {

    static create(
        telegramId: number,
        chatId: string,
        chatTitle: string,
        chatType: string
    ) {

        return db.prepare(`
            INSERT INTO monitor_chats (

                telegram_id,

                chat_id,

                chat_title,

                chat_type,

                verified

            )
            VALUES (?, ?, ?, ?, 1)
        `).run(

            telegramId,

            chatId,

            chatTitle,

            chatType

        );

    }

    static findByTelegramId(
        telegramId: number
    ) {

        return db.prepare(`
            SELECT *

            FROM monitor_chats

            WHERE telegram_id = ?

            LIMIT 1
        `).get(telegramId);

    }

    static findByChatId(
        chatId: string
    ) {

        return db.prepare(`
            SELECT *

            FROM monitor_chats

            WHERE chat_id = ?

            LIMIT 1
        `).get(chatId);

    }

    static isVerified(
        telegramId: number
    ): boolean {

        const row: any = db.prepare(`
            SELECT COUNT(*) AS total

            FROM monitor_chats

            WHERE

                telegram_id = ?

            AND

                verified = 1
        `).get(telegramId);

        return row.total > 0;

    }

    static updateVerified(
        chatId: string,
        verified: boolean
    ) {

        return db.prepare(`
            UPDATE monitor_chats

            SET verified = ?

            WHERE chat_id = ?
        `).run(

            verified ? 1 : 0,

            chatId

        );

    }

    static countByTelegramId(
        telegramId: number
    ) {

        return db.prepare(`
            SELECT COUNT(*) AS total

            FROM monitor_chats

            WHERE telegram_id = ?
        `).get(telegramId);

    }

    static deleteByChatId(
        chatId: string
    ) {

        return db.prepare(`
            DELETE

            FROM monitor_chats

            WHERE chat_id = ?
        `).run(chatId);

    }

    static deleteByTelegramId(
        telegramId: number
    ) {

        return db.prepare(`
            DELETE

            FROM monitor_chats

            WHERE telegram_id = ?
        `).run(telegramId);

    }

}