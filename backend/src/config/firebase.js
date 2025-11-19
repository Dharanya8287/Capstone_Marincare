import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!admin.apps.length) {
    try {
        // Use environment variables for security instead of importing a file
        // This prevents accidental commit of credentials
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        // Validate required environment variables
        if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
            throw new Error(
                "Missing Firebase credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file."
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("❌ Firebase Admin SDK initialization error:", error.message);
        console.error("=======================================================================");
        console.error("Please ensure you have set the following in your .env file:");
        console.error("- FIREBASE_PROJECT_ID");
        console.error("- FIREBASE_CLIENT_EMAIL");
        console.error("- FIREBASE_PRIVATE_KEY");
        console.error("=======================================================================");
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
}

export default admin;