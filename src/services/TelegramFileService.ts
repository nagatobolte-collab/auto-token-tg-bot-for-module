import axios from "axios";
import { ENV } from "../config/env";

export class TelegramFileService {

    static async download(filePath: string) {

        const url =
            `https://api.telegram.org/file/bot${ENV.BOT_TOKEN}/${filePath}`;

        const response = await axios.get(url);

        return response.data;

    }

}