import crypto from "crypto";
import { LICENSE } from "../constants/license";

export function generateLicenseKey(): string {
    const random = crypto.randomBytes(4).toString("hex").toUpperCase();

    return `${LICENSE.PREFIX}X-${random.slice(0, 4)}-${random.slice(4, 8)}`;
}