
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup
} = require("../controllers/groupController");

const {
  addMember,
  getMembers,
} = require("../controllers/groupMemberController");

const { balanceController } = require("../controllers/balanceController");

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getGroups);

// Specific group details
router.get("/:groupId", authMiddleware, getGroupById);

// Group members
router.post("/:groupId/members", authMiddleware, addMember);
router.get("/:groupId/members", authMiddleware, getMembers);

// Group balance
router.get("/:groupId/balance", authMiddleware, balanceController);

router.patch("/:groupId", authMiddleware, updateGroup)

module.exports = router;
