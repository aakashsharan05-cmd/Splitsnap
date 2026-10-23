const Settlement = require("../model/settlement.model")
const GroupMember = require("../model/group.member.model");

const settlementController = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const groupId = req.params.groupId;

        const fromUserId = requesterId;
        const toUserId = req.body.to;

        const isExist = await GroupMember.findOne({
            userId: requesterId,
            groupId
        });


        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group"
            });
        }
         const isFromExist = await GroupMember.findOne({
            userId: fromUserId,
            groupId
        });


        if (!isFromExist) {
            return res.status(403).json({
                message: "payer is not in the group"
            });
        }
        const isToExist = await GroupMember.findOne({
            userId: toUserId,
            groupId
        });

        if (!isToExist) {
            return res.status(403).json({
                message: "User is not in the group"
            });
        }

        if(fromUserId===toUserId){
              return res.status(400).json({
                message: "Payer and Reciever are same"
            });
        }
        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be a valid positive number"
            });
        }
        await Settlement.create({
            groupId,
            from: requesterId,
            to: toUserId,
            amount
        });
        return res.status(201).json({
            message: "Settlement created successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = { settlementController } 