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

        console.log("================================");
        console.log("LICENSE ACTIVATION START");
        console.log("Key:", key);
        console.log("Telegram ID:", telegramId);

        const license: any =
            LicenseRepository.findByKey(key);

        console.log("License:", license);

        if (!license) {

            console.log("❌ License not found");

            return {
                success: false,
                message: "❌ Invalid activation key."
            };

        }

        if (license.status !== "unused") {

            console.log("❌ License already used");

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

        console.log("License activated.");

        if (!UserRepository.exists(telegramId)) {

            console.log("Creating new user...");

            UserRepository.create({

                telegramId,

                username: user.username,

                firstName: user.firstName,

                lastName: user.lastName,

                licenseId: license.id,

                state: UserState.WAITING_GROUP

            });

            console.log("User created.");

        } else {

            console.log("User already exists.");

            UserRepository.updateLicense(

                telegramId,

                license.id

            );

            UserRepository.updateState(

                telegramId,

                UserState.WAITING_GROUP

            );

        }

        const createdUser =
            UserRepository.findByTelegramId(
                telegramId
            );

        console.log("User in DB:");
        console.log(createdUser);

        console.log("================================");

        return {

            success: true,

            plan: license.plan

        };

    }

}