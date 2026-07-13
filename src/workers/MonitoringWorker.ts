import { bot } from "../bot/bot";

import { MONITOR } from "../constants/monitor";

import { MonitoringRepository } from "../database/repositories/MonitoringRepository";

export function startMonitoringWorker() {

    setInterval(async () => {

        const sessions: any[] =
            MonitoringRepository.findRunning();

        const now = Date.now();

        for (const session of sessions) {

            const expires =
                new Date(session.expires_at).getTime();

            const remaining =
                expires - now;

            // 30 second warning

            if (

                remaining <=
                MONITOR.WARNING_BEFORE_SECONDS * 1000

                &&

                remaining > 0

                &&

                session.warning_sent === 0

            ) {

                MonitoringRepository.markWarningSent(
                    session.telegram_id
                );

                try {

                    await bot.telegram.sendMessage(

                        session.telegram_id,

`⚠️ Monitoring will stop in ${MONITOR.WARNING_BEFORE_SECONDS} seconds.`

                    );

                } catch {}

            }

            // Timeout

            if (remaining <= 0) {

                MonitoringRepository.stop(

                    session.telegram_id,

                    "timeout"

                );

                MonitoringRepository.remove(

                    session.telegram_id

                );

                try {

                    await bot.telegram.sendMessage(

                        session.telegram_id,

`🛑 Monitoring stopped automatically.

Reason
Timeout (${MONITOR.DEFAULT_TIMEOUT_MINUTES} Minutes)

Use /finddevice and /startmonitor again whenever you want to continue.`

                    );

                } catch {}

            }

        }

    }, MONITOR.WORKER_INTERVAL_MS);

}