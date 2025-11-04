import admin from "firebase-admin";
import { fileURLToPath } from "url";
import path from "path";
import serviceAccount from "./serviceAccount.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            // Use the imported serviceAccount object
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("❌ Firebase Admin SDK initialization error:", error.message);
        console.error("=======================================================================");
        console.error("IF YOU SEE 'Invalid JWT Signature' or 'invalid_grant':");
        console.error("You MUST generate a new service account key file from your");
        console.error("Firebase project console and replace 'backend/src/config/serviceAccount.json'.");
        console.error("=======================================================================");
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
}

export default admin;

