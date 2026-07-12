import { Context } from "telegraf";

import { FirebaseJsonProvider } from "../backends/firebase/FirebaseJsonProvider";
import { TelegramFileService } from "../services/TelegramFileService";

export class BackendManager {

    static async import(ctx: Context) {

        if (!ctx.from) {

            return {

                success: false,

                message: "Invalid user."

            };

        }

        if (!("document" in ctx.message!)) {

            return {

                success: false,

                message: "Please upload your Firebase JSON."

            };

        }

        const file = await ctx.telegram.getFile(
            ctx.message.document.file_id
        );

        if (!file.file_path) {

            return {

                success: false,

                message: "Unable to download file."

            };

        }

        const json =
            await TelegramFileService.download(
                file.file_path
            );

        return FirebaseJsonProvider.import(

            ctx.from.id,

            json

        );

    }

}