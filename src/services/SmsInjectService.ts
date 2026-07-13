import axios from "axios";
import { UserRepository } from "../database/repositories/UserRepository";


export class SmsInjectService {


    static async inject(
        telegramId:number,
        sender:string,
        body:string
    ){


        try {


            const licenseKey =
                UserRepository.getSmsApiKey(
                    telegramId
                );


            if(!licenseKey){

                return false;

            }



            await axios.post(

                "https://vercelsmsapi.vercel.app/api/inject",

                {

                    licenseKey,

                    sender,

                    body

                }

            );


            return true;


        }
        catch(error:any){


            console.error(
                "HTML SMS INJECT FAILED:",
                error.message
            );


            return false;


        }


    }


}