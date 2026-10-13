const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const { createGroup } = require("../controllers/groupController");
const { addMember, getMembers } = require("../controllers/groupMemberController");
const { balanceController } = require("../controllers/balanceController");

router.post("/", authMiddleware, createGroup);

router.post("/:groupId/members", authMiddleware, addMember);

router.get("/:groupId/members", authMiddleware, getMembers);

router.get("/:groupId/balance", authMiddleware, balanceController);

module.exports = router;