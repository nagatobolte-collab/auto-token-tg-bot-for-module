import { Telegraf } from "telegraf";

import { generateLicenseKey } from "../../utils/licenseGenerator";
import { LicenseRepository } from "../../database/repositories/LicenseRepository";
import { LICENSE } from "../../constants/license";

import { ownerOnly } from "../../middlewares/ownerOnly";

export function registerGenKeyCommand(bot: Telegraf) {

    bot.command(
        "genkey",
        ownerOnly,
        async (ctx) => {

            const args = ctx.message.text.trim().split(/\s+/);

            if (args.length !== 2) {

                await ctx.reply(
`Usage

/genkey lifetime

or

/genkey <days>

Examples

/genkey lifetime
/genkey 30
/genkey 15
/genkey 10
/genkey 7
/genkey 3`
                );

                return;

            }

            const input = args[1].toLowerCase();

            let durationDays = 0;

            let plan = LICENSE.LIFETIME;

            if (input !== "lifetime") {

                durationDays = Number(input);

                if (!Number.isInteger(durationDays) || durationDays <= 0) {

                    await ctx.reply("❌ Invalid number of days.");

                    return;

                }

                plan = `${durationDays} Days`;

            }

            const key = generateLicenseKey();

            LicenseRepository.create(

                key,

                plan,

                durationDays,

                ctx.from.id

            );

            await ctx.reply(
`━━━━━━━━━━━━━━━━━━━━
✅ License Generated
📅 Plan
${plan}
🔑 Activation Key
<code>${key}</code>
📌 Status
Unused
━━━━━━━━━━━━━━━━━━━━`,
                {
                    parse_mode: "HTML"
                }
            );

        }

    );

}