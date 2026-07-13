import { ENV } from "../config/env";

export function isOwner(
    telegramId?: number
): boolean {

    if (!telegramId) {
        return false;
    }

    return telegramId === ENV.OWNER_ID;

}