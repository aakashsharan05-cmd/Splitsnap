const Group = require("../model/group.model");
const GroupMember = require("../model/group.member.model");

const createGroup = async (req, res) => {
    try {
       const { name, alertLimit, icon } = req.body;
        const group = await Group.create({
            name,
             icon,
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

const getGroups = async (req, res) => {
  try {
    const memberships = await GroupMember.find({
      userId: req.user.userId,
    }).populate("groupId");

    const groups = memberships
      .filter((membership) => membership.groupId)
      .map((membership) => membership.groupId);

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = { createGroup, getGroups };