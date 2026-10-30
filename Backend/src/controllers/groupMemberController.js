const GroupMember = require("../model/group.member.model");
const User = require("../model/user.model");

const addMember = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const newUserId = req.body.userId;
        const groupId = req.params.groupId;


        const isExist = await GroupMember.findOne({
            userId: requesterId,
            groupId
        });

        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group"
            });
        }


        const userExist = await User.findById(newUserId);

        if (!userExist) {
            return res.status(404).json({
                message: "User not found"
            });
        }

       
        const isUserExist = await GroupMember.findOne({
            userId: newUserId,
            groupId
        });

        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists in the group"
            });
        }

      
        await GroupMember.create({
            userId: newUserId,
            groupId,
            role: "member"
        });

        res.status(201).json({
            message: "Member added successfully"
        });

    } catch  {
        res.status(500).json({
            message: "Server error",
            
        });
    }
};

const getMembers = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const groupId = req.params.groupId;

        const isExist = await GroupMember.findOne({
            userId: requesterId,
            groupId
        });

        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group"
            });
        }

        const members = await GroupMember.find({
            groupId
        }).populate("userId", "name email avatar");

        return res.status(200).json({
            members
        });

    } catch {
        return res.status(500).json({
            message: "Server error",
           
        });
    }
};
module.exports = { addMember ,getMembers};