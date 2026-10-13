const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const { settlementController } = require("../controllers/settlementController");

router.post("/:groupId", authMiddleware, settlementController);

module.exports = router;