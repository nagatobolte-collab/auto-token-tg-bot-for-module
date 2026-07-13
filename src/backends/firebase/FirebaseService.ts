import * as admin from "firebase-admin";

export class FirebaseService {

    static connect(serviceAccount: any) {

        console.log("Firebase Admin:", Object.keys(admin));

        const appName = serviceAccount.project_id;

        try {

            return admin.getApp(appName);

        } catch {

            return admin.initializeApp(
                {
                    credential: admin.cert(serviceAccount),
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

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("🔥 Firebase Health Check");
            console.log("Project :", serviceAccount.project_id);

            const db = this.database(serviceAccount);

            console.log("📡 Connecting to Firebase...");

            const snapshot = await db.ref("/").once("value");

            console.log("✅ Firebase Connected");
            console.log(
                "Root Exists :",
                snapshot.exists()
            );

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            return true;

        } catch (error: any) {

            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.error("❌ Firebase Connection Failed");
            console.error("Project :", serviceAccount.project_id);

            if (error?.message) {
                console.error("Message :", error.message);
            }

            if (error?.code) {
                console.error("Code :", error.code);
            }

            console.error(error);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            return false;

        }

    }

}