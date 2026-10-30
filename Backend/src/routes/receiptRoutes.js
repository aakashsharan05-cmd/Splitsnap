const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadReceipt } = require("../controllers/receiptController");

const handleReceiptUpload = (req, res, next) => {
    upload.single("receipt")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({
                    message: "Receipt image must be smaller than 5 MB"
                });
            }

            return res.status(400).json({
                message: "Invalid file upload"
            });
        }

        if (err) {
            return res.status(400).json({
                message: "Only JPEG, PNG and WebP images are allowed"
            });
        }

        next();
    });
};

router.post(
    "/upload",
    authMiddleware,
    handleReceiptUpload,
    uploadReceipt
);

module.exports = router;