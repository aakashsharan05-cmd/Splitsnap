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

        const amount = Number(req.body.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                message: " Aount should be greater than 0"
            })
        }
        console.log("Amount:", req.body.amount, typeof req.body.amount);
        console.log(
            "Split amount:",
            req.body.splits?.[0]?.amount,
            typeof req.body.splits?.[0]?.amount
        );
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

            if (!Array.isArray(split) || split.length === 0) {
                return res.status(400).json({
                    message: "Splits must be a non-empty array"
                });
            }
            const members = await GroupMember.find({ groupId });

            const memberIds = new Set(
                members.map((member) => member.userId.toString())
            );

            let sumPaise = 0;
            const seenUsers = new Set();
            for (const s of split) {
                if (
                    !Number.isFinite(s.amount) ||
                    s.amount <= 0
                ) {
                    return res.status(400).json({
                        message: "Amount should be grater than 0"
                    });
                }
                if (!s.user) {
                    return res.status(400).json({
                        message: "Each memeber should be in group"
                    });
                }
                if (seenUsers.has(s.user.toString())) {
                    return res.status(400).json({
                        message: "Same user"
                    });
                }
                seenUsers.add(s.user.toString());
                if (!memberIds.has(s.user.toString())) {
                    return res.status(400).json({
                        message: "Each memeber should be in group"
                    });
                }
                sumPaise += Math.round(s.amount * 100);
            }

            const totalPaise = Math.round(amount * 100);

            if (sumPaise !== totalPaise) {
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

            if (!Array.isArray(sp) || sp.length === 0) {
                return res.status(400).json({
                    message: "Splits must be a non-empty array"
                });
            }

            const members = await GroupMember.find({ groupId });
            const memberIds = new Set(
                members.map(member => member.userId.toString())
            );

            const seenUsers = new Set();
            let sum = 0;

            for (const s of sp) {
                if (
                    typeof s.percentage !== "number" ||
                    !Number.isFinite(s.percentage) ||
                    s.percentage <= 0 ||
                    s.percentage > 100
                ) {
                    return res.status(400).json({
                        message: "Percentage must be between 0 and 100"
                    });
                }

                if (!s.user) {
                    return res.status(400).json({
                        message: "User is required for each split"
                    });
                }

                const userId = s.user.toString();

                if (!memberIds.has(userId)) {
                    return res.status(400).json({
                        message: "Each user must belong to the group"
                    });
                }

                if (seenUsers.has(userId)) {
                    return res.status(400).json({
                        message: "Duplicate user in splits"
                    });
                }

                seenUsers.add(userId);
                sum += s.percentage;
            }

            
            if (Math.abs(sum - 100) > 1e-9) {
                return res.status(400).json({
                    message: "Percentage must total 100"
                });
            }

           
            const totalPaise = Math.round(amount * 100);
            let allocatedPaise = 0;

            const splits = sp.map(s => {
                const sharePaise = Math.floor(
                    totalPaise * s.percentage / 100
                );

                allocatedPaise += sharePaise;

                return {
                    user: s.user,
                    amount: sharePaise / 100
                };
            });

           
            let remainder = totalPaise - allocatedPaise;

            for (let i = 0; remainder > 0; i++, remainder--) {
                splits[i].amount += 0.01;
                splits[i].amount = Math.round(splits[i].amount * 100) / 100;
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