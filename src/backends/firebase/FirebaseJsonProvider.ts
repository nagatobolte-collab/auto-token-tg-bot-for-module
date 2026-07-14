import { FirebaseRestClient } from "./FirebaseRestClient";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";



export class FirebaseJsonProvider {



    static async import(

        telegramId:number,

        json:any

    ){



        if(

            !json.project_id ||

            !json.database_url

        ){


            return {

                success:false,

                message:
                "Invalid Firebase JSON."

            };

        }






        try {





            const users =

                await FirebaseRestClient.getUsers(

                    json.database_url

                );







            const backend =

                BackendRepository.create({

                    telegramId,


                    backendType:

                    "firebase_json",



                    backendIdentifier:

                    json.project_id,



                    config:

                    JSON.stringify(json)

                });









            const totalDevices =

                await FirebaseDeviceSync.sync(


                    Number(

                        backend.lastInsertRowid

                    ),


                    users


                );









            return {


                success:true,


                backendIdentifier:

                    json.project_id,



                totalDevices



            };







        }

        catch(error:any){



            console.error(

                "Firebase JSON Import Error:",

                error.response?.data ||

                error.message

            );





            return {


                success:false,


                message:

                "Unable to connect to Firebase."

            };



        }




    }



}