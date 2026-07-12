import { Context } from "telegraf";

export async function vpsHandler(ctx: Context) {

    await ctx.reply(
        "🖥️ Please send your VPS Panel URL."
    );

}