import { db } from "../database";
import { UserState } from "../../enums/UserState";

export class UserRepository {

    static findByTelegramId(telegramId: number) {
        return db
            .prepare(`
                SELECT *
                FROM users
                WHERE telegram_id = ?
            `)
            .get(telegramId);
    }

    static exists(telegramId: number): boolean {
        return !!this.findByTelegramId(telegramId);
    }

    static create(user: {
        telegramId: number;
        username?: string;
        firstName?: string;
        lastName?: string;
        licenseId: number;
        state: UserState;
    }) {
        return db
            .prepare(`
                INSERT INTO users (
                    telegram_id,
                    username,
                    first_name,
                    last_name,
                    license_id,
                    state
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .run(
                user.telegramId,
                user.username ?? null,
                user.firstName ?? null,
                user.lastName ?? null,
                user.licenseId,
                user.state
            );
    }

    static updateState(
        telegramId: number,
        state: UserState
    ) {
        return db
            .prepare(`
                UPDATE users
                SET state = ?
                WHERE telegram_id = ?
            `)
            .run(state, telegramId);
    }

    static updateLicense(
        telegramId: number,
        licenseId: number
    ) {
        return db
            .prepare(`
                UPDATE users
                SET license_id = ?
                WHERE telegram_id = ?
            `)
            .run(licenseId, telegramId);
    }

    static delete(telegramId: number) {
        return db
            .prepare(`
                DELETE FROM users
                WHERE telegram_id = ?
            `)
            .run(telegramId);
    }

}