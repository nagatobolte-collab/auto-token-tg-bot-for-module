import { MessageLog } from "../types/MessageLog";
import { MessageLogRepository } from "../database/repositories/MessageLogRepository";

export class MessageIndexer {

    static index(data: MessageLog) {

        const receivedAt =
            data.receivedAt ??
            new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

        return MessageLogRepository.insert({

            ...data,

            receivedAt

        });

    }

}