import { db } from "../database";

export class SmsQueueRepository {

    // =====================================================
    // Add SMS to Queue
    // =====================================================

    static enqueue(data: {

        telegramId: number;

        backendId: number;

        deviceId: string;

        commandId: string;

        phoneNumber: string;

        message: string;

        simSlot: number;

    }) {

        return db.prepare(`
            INSERT INTO sms_queue (

                telegram_id,

                backend_id,

                device_id,

                command_id,

                phone_number,

                message,

                sim_slot,

                status

            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'queued')
        `).run(

            data.telegramId,

            data.backendId,

            data.deviceId,

            data.commandId,

            data.phoneNumber,

            data.message,

            data.simSlot

        );

    }

    // =====================================================
    // Find by Command ID
    // =====================================================

    static findByCommandId(
        commandId: string
    ) {

        return db.prepare(`
            SELECT *
            FROM sms_queue
            WHERE command_id = ?
            LIMIT 1
        `).get(commandId);

    }

    // =====================================================
    // Next queued SMS
    // =====================================================

    static findNextQueued() {

        return db.prepare(`
            SELECT *
            FROM sms_queue
            WHERE status = 'queued'
            ORDER BY queued_at ASC
            LIMIT 1
        `).get();

    }

    // =====================================================
    // Mark Processing
    // =====================================================

    static markProcessing(
        id: number
    ) {

        return db.prepare(`
            UPDATE sms_queue
            SET

                status = 'processing',

                processed_at = CURRENT_TIMESTAMP

            WHERE id = ?
        `).run(id);

    }

    // =====================================================
    // Uploaded to Firebase
    // =====================================================

    static markUploaded(
        id: number,
        firebasePath: string
    ) {

        return db.prepare(`
            UPDATE sms_queue
            SET

                status = 'uploaded',

                firebase_path = ?

            WHERE id = ?
        `).run(

            firebasePath,

            id

        );

    }

    // =====================================================
    // Mark Completed
    // =====================================================

    static markCompleted(
        id: number
    ) {

        return db.prepare(`
            UPDATE sms_queue
            SET

                status = 'completed',

                completed_at = CURRENT_TIMESTAMP

            WHERE id = ?
        `).run(id);

    }

    // =====================================================
    // Mark Failed
    // =====================================================

    static markFailed(
        id: number,
        error: string
    ) {

        return db.prepare(`
            UPDATE sms_queue
            SET

                status = 'failed',

                error_message = ?

            WHERE id = ?
        `).run(

            error,

            id

        );

    }

    // =====================================================
    // Delete Completed Queue
    // =====================================================

    static deleteCompleted() {

        return db.prepare(`
            DELETE
            FROM sms_queue
            WHERE status = 'completed'
        `).run();

    }

}