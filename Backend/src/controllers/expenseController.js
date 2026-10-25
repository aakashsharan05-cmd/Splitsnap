const GroupMember = require("../model/group.member.model");
const User = require("../model/user.model");
const Expense = require("../model/expense.model");

const expenseSplit = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const groupId = req.params.groupId;
        const paidBy = req.body.paidBy;


        const isExist = await GroupMember.findOne({
            userId: requesterId,
            groupId
        });

        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group"
            });
        }


        const isPaidByExist = await GroupMember.findOne({
            userId: paidBy,
            groupId
        });

        if (!isPaidByExist) {
            return res.status(403).json({
                message: "Paid by is not in the group"
            });
        }

        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;
        const splitType = req.body.splitType;

        if (splitType === "equal") {
            const members = await GroupMember.find({ groupId });

            const totalMembers = members.length;

            if (totalMembers === 0) {
                return res.status(400).json({
                    message: "No members found in this group"
                });
            }

            const totalPaise = Math.round(Number(amount) * 100);
            const baseShare = Math.floor(totalPaise / totalMembers);
            const remainder = totalPaise % totalMembers;

            const splits = [];

            for (let i = 0; i < totalMembers; i++) {
                const member = members[i];

                const sharePaise = baseShare + (i < remainder ? 1 : 0);

                splits.push({
                    user: member.userId,
                    amount: sharePaise / 100
                });
            }

            await Expense.create({
                groupId,
                description,
                amount: totalPaise / 100,
                paidBy,
                category,
                splitType,
                splits
            });
        }


        else if (splitType === "exact") {

            const split = req.body.splits;

            let sum = 0;

            for (const s of split) {
                sum += s.amount;
            }

            if (sum !== amount) {
                return res.status(400).json({
                    message: "Split amounts must equal expense amount"
                });
            }

            await Expense.create({
                groupId,
                description,
                amount,
                paidBy,
                category,
                splitType,
                splits: split
            });
        }


        else if (splitType === "percentage") {

            const sp = req.body.splits;

            let sum = 0;


            for (const s of sp) {
                sum += s.percentage;
            }

            if (sum !== 100) {
                return res.status(400).json({
                    message: "Percentage must total 100"
                });
            }

            const splits = [];


            for (const s of sp) {

                const userAmount = amount * s.percentage / 100;

                splits.push({
                    user: s.user,
                    amount: userAmount
                });
            }

            await Expense.create({
                groupId,
                description,
                amount,
                paidBy,
                category,
                splitType,
                splits
            });
        }

        else {
            return res.status(400).json({
                message: "Invalid split type"
            });
        }

        return res.status(201).json({
            message: "Expense added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getGroupExpenses = async (req, res) => {


    try {
        const { groupId } = req.params;

        const userId = req.user.userId

        const isExist = await GroupMember.findOne({
            userId,
            groupId
        });

        if (!isExist) {
            return res.status(403).json({
                message: "Requester is not in the group"
            });
        }
        const expenses = await Expense.find({ groupId }).populate('paidBy', 'name email').sort({ createdAt: -1 })

        return res.status(200).json({
            expenses
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}



module.exports = { expenseSplit, getGroupExpenses };