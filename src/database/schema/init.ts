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

            phone_number TEXT,

            model TEXT,

            android_version TEXT,

            battery INTEGER DEFAULT 0,

            sim_count INTEGER DEFAULT 1,

            status TEXT DEFAULT 'offline',

            last_seen DATETIME,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(backend_id, device_id),

            FOREIGN KEY (backend_id)
                REFERENCES backends(id)
                ON DELETE CASCADE

        );
    `);

    // ---------------- MONITOR GROUPS ----------------

    db.exec(`
        CREATE TABLE IF NOT EXISTS monitor_groups (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            telegram_id INTEGER NOT NULL,

            group_id TEXT UNIQUE NOT NULL,

            group_name TEXT,

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