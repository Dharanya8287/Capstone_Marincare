import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Global GridFS bucket reference
let gridfsBucket = null;

// Connect to MongoDB and initialize GridFS
export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

        // Initialize GridFS after connection
        gridfsBucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
            bucketName: "uploads",
        });

        console.log("✅ GridFS Bucket initialized");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    }
}

// Export both for other services
export { gridfsBucket };
