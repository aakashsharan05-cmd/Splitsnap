const GroupMember = require("../model/group.member.model");
const Settlement = require("../model/settlement.model");
const Expense = require("../model/expense.model");

const balanceController = async (req, res) => {
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

        const expenses = await Expense.find({
            groupId
        });
        const settlement = await Settlement.find({
            groupId
        });
        const members = await GroupMember.find({ groupId }).populate(
            "userId",
            "name email avatar"
        );
        const finalAmount = members.map((member) => ({
            user: member.userId,
            balance: 0,
        }));

        for (const member of members) {
            finalAmount.push({
                user: member.userId,
                balance: 0
            });
        }
        for (const e of expenses) {
            const paidId = e.paidBy;
            const amount = e.amount;
            const splits = e.splits;

            const userBalance = finalAmount.find(
                x => x.user.toString() === paidId.toString()
            );

            userBalance.balance += amount;

            for (const split of splits) {
                const splitBalance = finalAmount.find(
                    x => x.user.toString() === split.user.toString()
                );

                splitBalance.balance -= split.amount;
            }
        }
        for (const s of settlement) {
            const paidId = s.from;
            const to = s.to;
            const amount = s.amount;

            const userFromBalance = finalAmount.find(
                x => x.user.toString() === paidId.toString()
            );

            userFromBalance.balance += amount;
            const usertoBalance = finalAmount.find(
                x => x.user.toString() === to.toString()
            );

            usertoBalance.balance -= amount;
        }

        return res.status(200).json({
            finalAmount
        });



    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = { balanceController } 