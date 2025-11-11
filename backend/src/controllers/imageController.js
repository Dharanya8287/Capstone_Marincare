import { gridfsBucket } from "../config/db.js";
import mongoose from "mongoose";

export const getImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid image ID" });
        }

        if (!gridfsBucket) {
            return res.status(500).json({ error: "GridFS not initialized" });
        }

        const downloadStream = gridfsBucket.openDownloadStream(new mongoose.Types.ObjectId(id));

        downloadStream.on("error", () => {
            res.status(404).json({ error: "Image not found" });
        });

        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType || "image/jpeg");
        });

        downloadStream.pipe(res);
    } catch (err) {
        console.error("Error fetching image:", err);
        res.status(500).json({ error: "Failed to fetch image" });
    }
};
