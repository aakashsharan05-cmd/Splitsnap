
const Group = require("../model/group.model");
const GroupMember = require("../model/group.member.model");

const createGroup = async (req, res) => {
  try {
    const { name, alertLimit, icon } = req.body;

    const group = await Group.create({
      name,
      icon,
      alertLimit,
      createdBy: req.user.userId,
    });

    await GroupMember.create({
      userId: req.user.userId,
      groupId: group._id,
      role: "admin",
    });

    return res.status(201).json({
      message: "Group created successfully",
      group: {
        _id: group._id,
        name: group.name,
        alertLimit: group.alertLimit,
        icon: group.icon,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getGroups = async (req, res) => {
  try {
    const memberships = await GroupMember.find({
      userId: req.user.userId,
    }).populate("groupId");

    const groups = memberships
      .filter((membership) => membership.groupId)
      .map((membership) => membership.groupId);

    return res.status(200).json({ groups });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get one group's details
const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    // Check whether the logged-in user belongs to this group
    const membership = await GroupMember.findOne({
      groupId,
      userId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this group.",
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found.",
      });
    }

    return res.status(200).json({ group });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid group ID.",
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const membership = await GroupMember.findOne({
      groupId,
      userId,
    });

    if (!groupId) {
      return res.status(403).json({
        message: "User is not in the group",

      });
    }

    if (!membership) {
      return res.status(403).json({
        message: "User is not in the group",

      });
    }
    const { name, alertLimit, icon } = req.body;
    const updateData = {};
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (alertLimit !== undefined) updateData.alertLimit = alertLimit;

    const updatedgroup = await Group.findByIdAndUpdate(
      groupId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedgroup) {
      return res.status(404).json({
        message: "User is not in the group",

      });
    }

    return res.status(200).json({
      message: "Group Updated successfully",
      updatedgroup

    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup
};
