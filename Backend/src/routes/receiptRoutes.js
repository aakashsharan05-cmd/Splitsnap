const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadReceipt } = require("../controllers/receiptController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("receipt"),
    uploadReceipt
);

module.exports = router;