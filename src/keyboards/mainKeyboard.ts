import { Markup } from "telegraf";

export const mainKeyboard = Markup.keyboard([
    ["➕ Add Backend"],
    ["📱 Find Device", "📡 Start Monitor"],
    ["👤 Profile", "❓ Help"]
])
.resize()
.persistent();