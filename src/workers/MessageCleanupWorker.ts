import { MessageLogRepository } from "../database/repositories/MessageLogRepository";
import { logger } from "../logger/logger";

export function startMessageCleanupWorker() {

    setInterval(() => {

        const result =
            MessageLogRepository.deleteOlderThan24Hours();

        logger.info(
            `Message cleanup removed ${result.changes} old messages.`
        );

    }, 60 * 60 * 1000);

}