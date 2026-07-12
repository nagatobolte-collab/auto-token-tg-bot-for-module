import { db } from "../database";

export class MonitorGroupRepository {

    static create(
        telegramId: number,
        groupId: string,
        groupName: string
    ) {
        return db.prepare(`
            INSERT INTO monitor_groups (
                telegram_id,
                group_id,
                group_name,
                verified
            )
            VALUES (?, ?, ?, 1)
        `).run(
            telegramId,
            groupId,
            groupName
        );
    }

    static findByTelegramId(
        telegramId: number
    ) {
        return db.prepare(`
            SELECT *
            FROM monitor_groups
            WHERE telegram_id = ?
        `).get(telegramId);
    }

    static findByGroupId(
        groupId: string
    ) {
        return db.prepare(`
            SELECT *
            FROM monitor_groups
            WHERE group_id = ?
        `).get(groupId);
    }

}