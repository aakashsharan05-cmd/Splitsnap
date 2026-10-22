const GroupMember = require("../model/group.member.model");
const Settlement = require("../model/settlement.model");
const Expense = require("../model/expense.model");


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

        // Fetch expenses, settlements and group members
        const [expenses, settlements, members] = await Promise.all([
            Expense.find({ groupId }),
            Settlement.find({ groupId }),
            GroupMember.find({ groupId }).populate(
                "userId",
                "name email avatar"
            ),
        ]);

        // Initialize one balance entry per group member
        const finalAmount = members.map((member) => {
            if (!member.userId) {
                throw new Error(
                    `Group member ${member._id} has no associated user`
                );
            }

            return {
                user: member.userId._id,
                name: member.userId.name,
                balance: 0,
            };
        });

        // Helper: find a member's balance safely
        const getBalance = (userId) => {
            const balance = finalAmount.find(
                (item) =>
                    item.user.toString() === userId.toString()
            );

            if (!balance) {
                throw new Error(
                    `User ${userId} is not present in group balances`
                );
            }

            return balance;
        };

        // Apply expenses
        for (const expense of expenses) {
            const paidId = expense.paidBy;
            const amount = Number(expense.amount);

            // Payer receives credit for the full expense
            getBalance(paidId).balance += amount;

            // Each participant owes their share
            for (const split of expense.splits) {
                getBalance(split.user).balance -= Number(split.amount);
            }
        }

        // Apply settlements
        for (const settlement of settlements) {
            const fromBalance = getBalance(settlement.from);
            const toBalance = getBalance(settlement.to);
            const amount = Number(settlement.amount);

            fromBalance.balance += amount;
            toBalance.balance -= amount;
        }

        return res.status(200).json({
            finalAmount,
        });
    } catch (error) {
        console.error("Balance controller error:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = { balanceController } 