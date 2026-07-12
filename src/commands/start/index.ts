import { Telegraf } from "telegraf";
import { UserService } from "../../services/UserService";
import { Messages } from "../../constants/messages";
import { mainKeyboard } from "../../keyboards/mainKeyboard";
import { UserState } from "../../enums/UserState";

export function registerStartCommand(bot: Telegraf) {

    bot.start(async (ctx) => {

        const telegramId = ctx.from.id;

        const user = UserService.getUser(telegramId);

        if (!user) {

            await ctx.reply(Messages.ACCESS_DENIED);

            return;

        }

        switch (user.state) {

            case UserState.WAITING_GROUP:

                await ctx.reply(Messages.SETUP, mainKeyboard);

                break;

            case UserState.WAITING_BACKEND:

                await ctx.reply(
                    "📌 Next Step\n\n➕ Please connect your first backend.",
                    mainKeyboard
                );

                break;

            case UserState.WAITING_DEVICE:

                await ctx.reply(
                    "📱 Next Step\n\nUse /finddevice and send your Device ID.",
                    mainKeyboard
                );

                break;

            case UserState.READY:

                await ctx.reply(
`Nagato Auto Token

🟢 License : Active
🟢 Status  : Ready`,
                    mainKeyboard
                );

                break;

            default:

                await ctx.reply(Messages.ACCESS_DENIED);

        }

    });

}