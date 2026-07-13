import { Context } from "telegraf";

import { FirebaseJsonProvider } from "../backends/firebase/FirebaseJsonProvider";
import { TelegramFileService } from "../services/TelegramFileService";

export class BackendManager {

    static async import(
        ctx: Context
    ) {

        if (!ctx.from) {

            return {
                success: false,
                message: "❌ Invalid Telegram user."
            };

        }

        if (!ctx.message || !("document" in ctx.message)) {

            return {
                success: false,
                message:
                    "📂 Please upload your Firebase Service Account JSON file."
            };

        }

        const document =
            ctx.message.document;

        if (
            document.mime_type &&
            document.mime_type !== "application/json"
        ) {

            return {
                success: false,
                message:
                    "❌ Only Firebase JSON files are supported."
            };

        }

        const file =
            await ctx.telegram.getFile(
                document.file_id
            );

        if (!file.file_path) {

            return {
                success: false,
                message:
                    "❌ Unable to download the uploaded file."
            };

        }

        const json =
            await TelegramFileService.download(
                file.file_path
            );

        return await FirebaseJsonProvider.import(

            ctx.from.id,

            json

        );

    }

}