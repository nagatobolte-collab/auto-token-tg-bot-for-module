import admin from "firebase-admin";

export class FirebaseService {

    static connect(serviceAccount: any) {

        const appName = serviceAccount.project_id;

        try {

            return admin.app(appName);

        } catch {

            return admin.initializeApp(
                {
                    credential: admin.credential.cert(serviceAccount),
                    databaseURL:
                        `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
                },
                appName
            );

        }

    }

    static database(serviceAccount: any) {

        return this.connect(serviceAccount).database();

    }

    static async healthCheck(serviceAccount: any) {

        try {

            const db = this.database(serviceAccount);

            await db.ref("/").once("value");

            return true;

        } catch {

            return false;

        }

    }

}