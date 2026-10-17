const express = require("express");

const router = express.Router();
const authMiddleware=require("../middleware/authmiddleware")
const searchUser =require("../controllers/userController")

router.get("/", authMiddleware, searchUser);

module.exports = router;