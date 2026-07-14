import { FirebaseRestClient } from "./FirebaseRestClient";
import { FirebaseDeviceSync } from "./FirebaseDeviceSync";

import { BackendRepository } from "../../database/repositories/BackendRepository";


export class FirebaseUrlProvider {



    static async import(
        telegramId:number,
        databaseUrl:string,
        authKey?:string
    ){


        if(!databaseUrl){


            return {

                success:false,

                message:
                    "Invalid Firebase URL."

            };

        }



        try {



            const users =
                await FirebaseRestClient.getUsers(

                    databaseUrl,

                    authKey

                );




            /*
                Firebase protected database
            */

            if(
                users === null ||
                users === undefined
            ){


                return {

                    success:false,

                    authRequired:true,

                    message:
                    "Firebase authentication required."

                };

            }






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
                            databaseUrl,


                        auth_key:
                            authKey ?? null

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





        }
        catch(error:any){



            console.error(
                "Firebase URL Import Error:",
                error.response?.data ||
                error.message
            );




            /*
                Permission denied means
                auth required / wrong key
            */


            if(
                error.response?.data?.error ===
                "Permission denied"
            ){

                return {


                    success:false,


                    authRequired:true,


                    message:
                    "Firebase authentication failed."

                };

            }







            return {


                success:false,


                message:
                "Unable to connect to Firebase."

            };



        }



    }



}