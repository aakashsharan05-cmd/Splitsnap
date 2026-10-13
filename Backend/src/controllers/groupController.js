const Group = require("../model/group.model");
const GroupMember = require("../model/group.member.model");

const createGroup = async (req, res) => {
    try {
        const { name, alertLimit } = req.body;
        const group = await Group.create({
            name,

            alertLimit,
            createdBy: req.user.userId
        });

           await GroupMember.create({
            userId: req.user.userId,
            groupId: group._id,
            role: "admin"
        });
        res.status(201).json({
            message: "Group created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}
module.exports = { createGroup };