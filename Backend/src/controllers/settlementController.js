const Settlement = require("../model/settlement.model")
const GroupMember = require("../model/group.member.model");
const { getGroupBalances } = require("../services/balanceService");

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




        const isToExist = await GroupMember.findOne({
            userId: toUserId,
            groupId
        });

        if (!isToExist) {
            return res.status(403).json({
                message: "User is not in the group"
            });
        }

        if (String(fromUserId) === String(toUserId)) {
            return res.status(400).json({
                message: "Payer and receiver are the same"
            });
        }

        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: "Amount must be a valid positive number"
            });
        }
        const balances = await getGroupBalances(groupId);

        const userBalance = balances.find(
            item => String(item.user) === String(requesterId)
        );

        if (!userBalance) {
            return res.status(400).json({
                message: "User balance not found"
            });
        }

        const balance = Math.round(userBalance.balance * 100) / 100;

        if (balance >= 0) {
            return res.status(400).json({
                message: "You don't owe any money"
            });
        }

        const outstanding = Math.abs(balance);
        if (outstanding < amount) {
            return res.status(400).json({
                message: "Amount must be a less than outstanding balance"
            });
        }
        const receiverBalance = balances.find(
            item => String(item.user) === String(toUserId)
        );
        if (!receiverBalance) {
            return res.status(400).json({
                message: "User balance not found"
            });
        }
        const receiverAmount = Math.round(receiverBalance.balance * 100) / 100;

        if (receiverAmount <= 0) {
            return res.status(400).json({
                message: "Receiver is not owed any money"
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

    } catch {
        res.status(500).json({
            message: "Server error",
            
        });
    }
}

module.exports = { settlementController } 