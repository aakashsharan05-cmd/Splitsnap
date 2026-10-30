const imagekit = require("../db/imagekit");
const fs = require("fs");
const { extractReceiptData } = require("../services/receiptAIService");

const uploadReceipt = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No receipt uploaded"
            });
        }
        console.log("1. Starting ImageKit upload");
        const response = await imagekit.files.upload({
            file: fs.createReadStream(req.file.path),
            fileName: req.file.originalname
        });

        console.log("2. ImageKit upload completed");

        console.log("3. Starting AI extraction");

        const receiptData = await extractReceiptData(req.file.path);

        console.log("4. AI extraction completed");
        console.log("Temp file path:", req.file.path);
        console.log("File exists:", fs.existsSync(req.file.path));
        try {
            await fs.promises.unlink(req.file.path);
        } catch (error) {
            console.log("Temporary file deletion failed:", error.message);
        }

        return res.status(200).json({
            message: "Receipt processed successfully",
            url: response.url,
            receipt: receiptData
        });

    } catch (error) {
        console.error("Receipt upload error:", error);

        if (error.status === 429) {
            return res.status(429).json({
                message: "AI receipt scanning limit reached. Please try again later."
            });
        }

        return res.status(500).json({
            message: "Receipt processing failed"
        });
    }
};

module.exports = { uploadReceipt };