import { randomBytes } from "crypto";

export class VerificationCodeService {

    static generate(): string {

        const characters =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        const bytes = randomBytes(6);

        for (let i = 0; i < 6; i++) {

            code +=
                characters[
                    bytes[i] % characters.length
                ];

        }

        return `VERIFY-${code}`;

    }

}