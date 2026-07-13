import { db } from "../database";


export class ProcessedSmsRepository {



    static exists(data: {

        backendId: number;

        deviceId: string;

        source: string;

        uniqueKey: string;

    }) {


        const row:any =
            db.prepare(`

                SELECT id

                FROM processed_sms

                WHERE

                    backend_id = ?

                AND

                    device_id = ?

                AND

                    source = ?

                AND

                    unique_key = ?

                LIMIT 1

            `).get(

                data.backendId,

                data.deviceId,

                data.source,

                data.uniqueKey

            );


        return !!row;

    }





    static create(data: {

        backendId: number;

        deviceId: string;

        source: string;

        uniqueKey: string;

    }) {


        return db.prepare(`

            INSERT OR IGNORE INTO processed_sms

            (

                backend_id,

                device_id,

                source,

                unique_key

            )

            VALUES (?, ?, ?, ?)

        `).run(

            data.backendId,

            data.deviceId,

            data.source,

            data.uniqueKey

        );

    }





    // ======================================================
    // Mark existing SMS as processed
    // Called when /startmonitor begins
    // Prevents old Firebase SMS forwarding
    // ======================================================


    static bulkCreate(data: {

        backendId: number;

        deviceId: string;

        keys: string[];

    }) {


        if (
            !data.keys ||
            data.keys.length === 0
        ) {

            return;

        }



        const insert =
            db.prepare(`

                INSERT OR IGNORE INTO processed_sms

                (

                    backend_id,

                    device_id,

                    source,

                    unique_key

                )

                VALUES

                (

                    ?,

                    ?,

                    'incoming',

                    ?

                )

            `);




        const transaction =
            db.transaction(() => {


                for (
                    const key of data.keys
                ) {


                    insert.run(

                        data.backendId,

                        data.deviceId,

                        key

                    );


                }


            });




        transaction();


    }





}