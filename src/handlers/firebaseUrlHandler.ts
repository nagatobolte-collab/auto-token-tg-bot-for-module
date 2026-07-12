import { Context } from "telegraf";

export async function firebaseUrlHandler(ctx: Context) {

    await ctx.reply(
        "🌐 Please send your Firebase Realtime Database URL."
    );

}