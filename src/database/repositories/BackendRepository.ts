import { db } from "../database";

export class BackendRepository {

    static create(data: {
        telegramId: number;
        backendType: string;
        backendIdentifier: string;
        config: string;
    }) {
        return db.prepare(`
            INSERT INTO backends (
                telegram_id,
                backend_type,
                backend_identifier,
                config
            )
            VALUES (?, ?, ?, ?)
        `).run(
            data.telegramId,
            data.backendType,
            data.backendIdentifier,
            data.config
        );
    }

    static findByTelegramId(
        telegramId: number
    ) {
        return db.prepare(`
            SELECT *
            FROM backends
            WHERE telegram_id = ?
            ORDER BY id DESC
        `).all(telegramId);
    }

    static findByIdentifier(
        identifier: string
    ) {
        return db.prepare(`
            SELECT *
            FROM backends
            WHERE backend_identifier = ?
        `).get(identifier);
    }

    static updateStatus(
        id: number,
        status: string
    ) {
        return db.prepare(`
            UPDATE backends
            SET status = ?
            WHERE id = ?
        `).run(
            status,
            id
        );
    }

    static updateLastSync(
        id: number
    ) {
        return db.prepare(`
            UPDATE backends
            SET last_sync = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(id);
    }

    static countAll() {
        return db.prepare(`
            SELECT COUNT(*) total
            FROM backends
        `).get();
    }

    static countByType(
        type: string
    ) {
        return db.prepare(`
            SELECT COUNT(*) total
            FROM backends
            WHERE backend_type = ?
        `).get(type);
    }

}