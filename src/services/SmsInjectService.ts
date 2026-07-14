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


                console.error(
                    "SMS API FAILED: Missing license key"
                );


                return false;


            }








            const response =

                await axios.post(


                    "https://vercelsmsapi.vercel.app/api/inject",


                    {


                        licenseKey,


                        sender,


                        body


                    },


                    {

                        timeout:10000

                    }


                );








            console.log(
                "SMS API RESPONSE:",
                response.data
            );








            return true;




        }

        catch(error:any){



            console.error(

                "SMS API FAILED:",

                error.response?.data ||

                error.message

            );



            return false;



        }



    }



}