import { LicenseRepository } from "../database/repositories/LicenseRepository";
import { UserRepository } from "../database/repositories/UserRepository";
import { UserState } from "../enums/UserState";

export class LicenseService {

    static activateKey(
        key: string,
        telegramId: number,
        user: {
            username?: string;
            firstName?: string;
            lastName?: string;
        }
    ) {

        const license: any = LicenseRepository.findByKey(key);

        if (!license) {
            return {
                success: false,
                message: "❌ Invalid activation key."
            };
        }

        if (license.status !== "unused") {
            return {
                success: false,
                message: "❌ This activation key has already been used."
            };
        }

        let expiresAt: string | null = null;

        if (license.duration_days > 0) {

            const expire = new Date();

            expire.setDate(
                expire.getDate() + license.duration_days
            );

            expiresAt = expire
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");

        }

        LicenseRepository.activate(
            license.id,
            telegramId,
            expiresAt
        );

        if (!UserRepository.exists(telegramId)) {
            UserRepository.create({
                telegramId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                licenseId: license.id,
                state: UserState.WAITING_GROUP
            });
        } else {
            UserRepository.updateLicense(
                telegramId,
                license.id
            );

            UserRepository.updateState(
                telegramId,
                UserState.WAITING_GROUP
            );
        }

        return {
            success: true,
            plan: license.plan
        };

    }

}