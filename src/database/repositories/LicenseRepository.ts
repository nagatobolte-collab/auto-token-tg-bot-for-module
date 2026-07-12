import { db } from "../database";

export class LicenseRepository {

    static findByKey(key: string) {
        return db
            .prepare(`
                SELECT *
                FROM licenses
                WHERE license_key = ?
            `)
            .get(key);
    }

    static create(
        key: string,
        plan: string,
        durationDays: number,
        generatedBy: number
    ) {
        return db
            .prepare(`
                INSERT INTO licenses (
                    license_key,
                    plan,
                    duration_days,
                    generated_by
                )
                VALUES (?, ?, ?, ?)
            `)
            .run(
                key,
                plan,
                durationDays,
                generatedBy
            );
    }

    static activate(
        id: number,
        telegramId: number,
        expiresAt: string | null
    ) {
        return db
            .prepare(`
                UPDATE licenses
                SET
                    status = 'active',
                    telegram_id = ?,
                    activated_at = CURRENT_TIMESTAMP,
                    expires_at = ?
                WHERE id = ?
            `)
            .run(
                telegramId,
                expiresAt,
                id
            );
    }

    static revoke(id: number) {
        return db
            .prepare(`
                UPDATE licenses
                SET status = 'revoked'
                WHERE id = ?
            `)
            .run(id);
    }

    static delete(id: number) {
        return db
            .prepare(`
                DELETE FROM licenses
                WHERE id = ?
            `)
            .run(id);
    }

}