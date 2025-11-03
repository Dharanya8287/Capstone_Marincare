import { gridfsBucket } from "../config/db.js";
import { Readable } from "stream";

export async function uploadImage(buffer, filename) {
    if (!gridfsBucket) throw new Error("GridFS bucket not initialized");

    return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);

        const uploadStream = gridfsBucket.openUploadStream(filename);
        readable.pipe(uploadStream);

        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
    });
}
