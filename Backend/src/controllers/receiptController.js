
const getImageKitClient = require("../db/imagekit");
const fs = require("fs");
const { extractReceiptData } = require("../services/receiptAIService");

const uploadReceipt = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No receipt uploaded"
        });
    }

    try {
        // Initialize ImageKit client only when required
        const imagekit = getImageKitClient();

        // Upload receipt to ImageKit
        const response = await imagekit.files.upload({
            file: fs.createReadStream(req.file.path),
            fileName: req.file.filename || req.file.originalname
        });

        // Extract receipt details using AI
        const receiptData = await extractReceiptData(req.file.path);

        return res.status(200).json({
            message: "Receipt processed successfully",
            url: response.url,
            receipt: receiptData
        });

    } catch (error) {
        console.error("Receipt upload error:", error);

        if (error.status === 429 || error.statusCode === 429) {
            return res.status(429).json({
                message: "AI receipt scanning limit reached. Please try again later."
            });
        }

        return res.status(500).json({
            message: "Receipt processing failed"
        });

    } finally {
       
        try {
            await fs.promises.unlink(req.file.path);
        } catch (error) {
            console.error("Temporary receipt cleanup failed:", error);
        }
    }
};

module.exports = { uploadReceipt };
