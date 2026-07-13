import crypto from "crypto";


export interface ParsedTelegramMessage {

    success: boolean;

    phoneNumber?: string;

    message?: string;

    hash?: string;

    source: "telegram";

}


export class TelegramParserService {


    static parse(
        text: string
    ): ParsedTelegramMessage {


        if (!text) {

            return {
                success:false,
                source:"telegram"
            };

        }


        let phoneNumber = "";
        let message = "";



        // =====================================================
        // FORMAT 1
        // 📞 To:
        // 💬 Message:
        // =====================================================


        const format1Number =
            text.match(
                /📞\s*To:\s*([+\d\s-]+)/i
            );


        const format1Message =
            text.match(
                /💬\s*Message:\s*([\s\S]*?)(?:\n\n|📋|$)/i
            );


        if (format1Number) {

            phoneNumber =
                this.cleanNumber(
                    format1Number[1]
                );

        }


        if (format1Message) {

            message =
                format1Message[1].trim();

        }




        // =====================================================
        // FORMAT 2
        // To (Tap to copy):
        // Body (Tap to copy):
        // =====================================================


        if (!phoneNumber) {


            const number =
                text.match(
                    /To\s*\(Tap to copy\):\s*\n?([+\d]+)/i
                );


            if (number) {

                phoneNumber =
                    this.cleanNumber(
                        number[1]
                    );

            }

        }


        if (!message) {


            const body =
                text.match(
                    /Body\s*\(Tap to copy\):\s*\n?([\s\S]*?)(?:\n\n|📱|$)/i
                );


            if (body) {

                message =
                    body[1].trim();

            }

        }




        // =====================================================
        // FORMAT 3
        // 📤 To:
        // 💬 Text:
        // =====================================================


        if (!phoneNumber) {


            const to =
                text.match(
                    /📤\s*To:\s*\n?([+\d]+)/i
                );


            if (to) {

                phoneNumber =
                    this.cleanNumber(
                        to[1]
                    );

            }

        }



        if (!message) {


            const msg =
                text.match(
                    /💬\s*Text:\s*\n?([\s\S]*?)(?:\n\n|📊|$)/i
                );


            if (msg) {

                message =
                    msg[1].trim();

            }

        }





        // =====================================================
        // FALLBACK NUMBER SEARCH
        // =====================================================


        if (!phoneNumber) {


            const number =
                text.match(
                    /(?:\+?\d{10,15})/
                );


            if (number) {

                phoneNumber =
                    this.cleanNumber(
                        number[0]
                    );

            }

        }




        if (
            !phoneNumber ||
            !message
        ) {

            return {

                success:false,

                source:"telegram"

            };

        }





        const hash =
            crypto
                .createHash("sha256")
                .update(

                    phoneNumber +
                    "|" +
                    message

                )
                .digest("hex");



        return {

            success:true,

            phoneNumber,

            message,

            hash,

            source:"telegram"

        };


    }



    private static cleanNumber(
        value:string
    ){

        return value
            .replace(/\s+/g,"")
            .replace("-","")
            .replace("+","");

    }


}