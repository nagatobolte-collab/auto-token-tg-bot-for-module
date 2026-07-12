import { Markup } from "telegraf";

export const backendKeyboard = Markup.inlineKeyboard([
    [
        Markup.button.callback(
            "🟢 Firebase JSON",
            "backend_firebase_json"
        )
    ],
    [
        Markup.button.callback(
            "🔵 Firebase URL",
            "backend_firebase_url"
        )
    ],
    [
        Markup.button.callback(
            "🟣 VPS Panel",
            "backend_vps"
        )
    ]
]);