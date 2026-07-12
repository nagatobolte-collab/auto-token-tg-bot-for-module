import { Markup } from "telegraf";

export const setupKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.url(
            "➕ Add Bot To Group",
            "https://t.me/nagato_autotoken_bot?startgroup=true"
        )
    ],
    [
        Markup.button.callback(
            "✅ Verify Group",
            "verify_group"
        )
    ]
]);