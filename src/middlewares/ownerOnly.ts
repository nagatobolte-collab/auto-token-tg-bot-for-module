import { MiddlewareFn } from "telegraf";
import { ENV } from "../config/env";

const deniedMessages = [

`🚫 Oye Hero 😎

Ye command sirf Bot Owner ke liye hai.

Tum bas dekh sakte ho...
Chala nahi sakte. 😂`,

`👀 Arre Arre...

Permission dekh ke aao.

Owner Command hai ye. 🔐`,

`😂 Nice Try!

Command toh sahi tha...

Bas owner hona reh gaya. 😅`,

`🔒 Access Denied

Boss level command hai.

Abhi tum intern mode me ho. 😎`,

`🚷 Stop Right There!

Ye button dabane se owner nahi ban jaoge. 🤭`

];

export const ownerOnly: MiddlewareFn = async (
    ctx,
    next
) => {

    if (!ctx.from) {
        return;
    }

    if (ctx.from.id !== ENV.OWNER_ID) {

        const random =
            deniedMessages[
                Math.floor(
                    Math.random() * deniedMessages.length
                )
            ];

        await ctx.reply(random);

        return;

    }

    return next();

};