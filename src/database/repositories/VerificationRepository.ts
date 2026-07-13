import { db } from "../database";

export class VerificationRepository {

    static create(data: {
        telegramId: number;
        code: string;
        expiresAt: string;
    }) {

        db.prepare(`
            DELETE FROM verification_codes
            WHERE telegram_id = ?
        `).run(data.telegramId);

        return db.prepare(`
            INSERT INTO verification_codes (
                telegram_id,
                code,
                expires_at
            )
            VALUES (?, ?, ?)
        `).run(
            data.telegramId,
            data.code,
            data.expiresAt
        );

    }

    static findByCode(
        code: string
    ) {

        return db.prepare(`
            SELECT *
            FROM verification_codes
            WHERE code = ?
            LIMIT 1
        `).get(code);

    }

    static delete(
        telegramId: number
    ) {

        return db.prepare(`
            DELETE FROM verification_codes
            WHERE telegram_id = ?
        `).run(telegramId);

    }

}