import { Markup } from "telegraf";

export function deviceKeyboard(
    sim1Carrier?: string,
    sim2Carrier?: string
) {

    const buttons = [];

    buttons.push([
        Markup.button.callback(
            `📶 SIM 1 • ${sim1Carrier || "SIM 1"}`,
            "device_sim_1"
        )
    ]);

    if (sim2Carrier) {

        buttons.push([
            Markup.button.callback(
                `📶 SIM 2 • ${sim2Carrier}`,
                "device_sim_2"
            )
        ]);

    }

    return Markup.inlineKeyboard(buttons);

}