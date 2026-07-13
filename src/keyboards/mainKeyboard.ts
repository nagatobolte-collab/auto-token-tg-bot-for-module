import { Markup } from "telegraf";

export const mainKeyboard = Markup.keyboard([
    ["➕ Add Backend"],
    ["📱 Find Device", "📡 Start Monitor"],
    ["🛑 Stop Monitor"],
    ["👤 Profile", "❓ Help"]
])
.resize()
.persistent();