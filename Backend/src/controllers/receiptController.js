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

        const response = await imagekit.files.upload({
            file: fs.createReadStream(req.file.path),
            fileName: req.file.originalname
        });

        const receiptData = await extractReceiptData(req.file.path);

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
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { uploadReceipt };