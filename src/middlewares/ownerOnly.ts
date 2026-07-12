import { Context, NextFunction } from "telegraf";
import { ENV } from "../config/env";

export async function ownerOnly(
    ctx: Context,
    next: NextFunction
) {
    if (!ctx.from) return;

    if (ctx.from.id !== ENV.OWNER_ID) {
        await ctx.reply("❌ You are not authorized.");
        return;
    }

    return next();
}