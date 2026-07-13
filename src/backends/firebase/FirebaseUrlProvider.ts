import { FirebaseRestClient } from "./FirebaseRestClient";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";


export class FirebaseUrlProvider {


    static async import(
        telegramId:number,
        databaseUrl:string
    ){

        if(!databaseUrl){

            return {

                success:false,

                message:"Invalid Firebase URL."

            };

        }


        try {


            const users =
                await FirebaseRestClient.getUsers(
                    databaseUrl
                );



            const backend =
                BackendRepository.create({

                    telegramId,

                    backendType:
                        "firebase_url",


                    backendIdentifier:
                        databaseUrl,


                    config:
                        JSON.stringify({
                            database_url:
                                databaseUrl
                        })

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
                    databaseUrl,


                totalDevices

            };


        }catch(error:any){


            console.error(
                error
            );


            return {

                success:false,

                message:
                    "Unable to connect to Firebase."

            };


        }


    }


}
