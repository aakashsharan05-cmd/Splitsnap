const GroupMember = require("../model/group.member.model");
;
const { getGroupBalances } = require("../services/balanceService");


const balanceController = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const { groupId } = req.params;

        // Verify requester belongs to the group
        const isExist = await GroupMember.findOne({
            userId: requesterId,
            groupId,
        });

        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group",
            });
        }

        const finalAmount = await getGroupBalances(groupId);
        return res.status(200).json({ finalAmount });
    } catch (error) {
        console.error("Balance controller error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = { balanceController } 