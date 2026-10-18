const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const { expenseSplit, getGroupExpenses } = require("../controllers/expenseController");

router.post("/:groupId", authMiddleware, expenseSplit);
router.get("/:groupId", authMiddleware, getGroupExpenses);

module.exports = router;