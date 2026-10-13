const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const { expenseSplit } = require("../controllers/expenseController");

router.post("/:groupId", authMiddleware, expenseSplit);

module.exports = router;