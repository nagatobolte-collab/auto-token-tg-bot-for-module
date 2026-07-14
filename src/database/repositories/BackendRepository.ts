import { db } from "../database";


export class BackendRepository {



    static create(data:{
        telegramId:number;
        backendType:string;
        backendIdentifier:string;
        config:string;
    }){


        return db.prepare(`

            INSERT INTO backends (

                telegram_id,

                backend_type,

                backend_identifier,

                config

            )

            VALUES (?, ?, ?, ?)

        `).run(


            data.telegramId,


            data.backendType,


            data.backendIdentifier,


            data.config


        );


    }







    static findById(
        id:number
    ){


        return db.prepare(`

            SELECT *

            FROM backends

            WHERE id = ?

            LIMIT 1

        `).get(id);


    }









    static findConfig(
        id:number
    ){


        const backend:any =

            db.prepare(`

                SELECT *

                FROM backends

                WHERE id = ?

                LIMIT 1

            `).get(id);




        if(!backend){

            return null;

        }






        let config:any = {};



        try {


            config =
                JSON.parse(
                    backend.config
                );


        }
        catch{


            config =
                backend.config;


        }





        return {


            ...backend,


            config


        };



    }









    static findByTelegramId(
        telegramId:number
    ){



        return db.prepare(`

            SELECT *

            FROM backends

            WHERE telegram_id = ?

            ORDER BY id DESC

        `).all(

            telegramId

        );



    }









    static findByIdentifier(
        identifier:string
    ){


        return db.prepare(`

            SELECT *

            FROM backends

            WHERE backend_identifier = ?

            LIMIT 1

        `).get(

            identifier

        );


    }









    static updateStatus(
        id:number,
        status:string
    ){


        return db.prepare(`

            UPDATE backends

            SET status = ?

            WHERE id = ?

        `).run(

            status,

            id

        );


    }









    static updateLastSync(
        id:number
    ){


        return db.prepare(`

            UPDATE backends

            SET last_sync = CURRENT_TIMESTAMP

            WHERE id = ?

        `).run(

            id

        );


    }









    static delete(
        id:number
    ){


        return db.prepare(`

            DELETE

            FROM backends

            WHERE id = ?

        `).run(

            id

        );


    }









    static countAll(){


        return db.prepare(`

            SELECT COUNT(*) AS total

            FROM backends

        `).get();



    }









    static countByType(
        type:string
    ){


        return db.prepare(`

            SELECT COUNT(*) AS total

            FROM backends

            WHERE backend_type = ?

        `).get(

            type

        );


    }



}