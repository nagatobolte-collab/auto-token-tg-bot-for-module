import axios from "axios";

import { BackendRepository } from "../../database/repositories/BackendRepository";
import { DeviceRepository } from "../../database/repositories/DeviceRepository";


export class VpsProvider {


    static async import(
        telegramId:number,
        apiUrl:string
    ){

        try {


            apiUrl =
                apiUrl.trim().replace(/\/$/, "");



            // Try common device endpoints

            const endpoints = [

                "/api/devices",
                "/api/admin/devices",
                "/devices"

            ];



            let devices:any[] = [];

            let workingEndpoint = "";



            for(
                const endpoint of endpoints
            ){

                try {


                    const response =
                        await axios.get(
                            apiUrl + endpoint,
                            {
                                timeout:5000
                            }
                        );


                    if(
                        Array.isArray(response.data)
                    ){

                        devices =
                            response.data;

                        workingEndpoint =
                            endpoint;

                        break;

                    }


                    if(
                        response.data.devices &&
                        Array.isArray(
                            response.data.devices
                        )
                    ){

                        devices =
                            response.data.devices;

                        workingEndpoint =
                            endpoint;

                        break;

                    }


                }
                catch(e){}

            }




            if(!workingEndpoint){

                return {

                    success:false,

                    message:
                    "Device API not found."

                };

            }




            const backend =
                BackendRepository.create({

                    telegramId,

                    backendType:
                    "vps",

                    backendIdentifier:
                    apiUrl,

                    config:
                    JSON.stringify({

                        api_base_url:
                        apiUrl,

                        device_endpoint:
                        workingEndpoint

                    })

                });



            const backendId =
                Number(
                    backend.lastInsertRowid
                );




            const formattedDevices =
                devices.map(
                    (device:any)=>({

                        backendId,

                        deviceId:
                        device.device_id ||
                        device.id,

                        deviceName:
                        device.name ||
                        device.model ||
                        "VPS Device",

                        model:
                        device.model ||
                        "Unknown",

                        battery:
                        device.battery ||
                        0,

                        simCount:
                        device.sim_count ||
                        1,

                        activeSim:
                        device.active_sim ||
                        1,

                        status:
                        "online"

                    })
                );



            DeviceRepository.bulkUpsert(
                formattedDevices
            );




            return {

                success:true,

                backendIdentifier:
                apiUrl,

                totalDevices:
                formattedDevices.length

            };


        }
        catch(error:any){


            return {

                success:false,

                message:
                error.message

            };


        }


    }


}