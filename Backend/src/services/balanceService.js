const GroupMember = require("../model/group.member.model");
const Settlement = require("../model/settlement.model");
const Expense = require("../model/expense.model");

const getGroupBalances = async (groupId) => {
    try {
        const [expenses, settlements, members] = await Promise.all([
            Expense.find({ groupId }),
            Settlement.find({ groupId }),
            GroupMember.find({ groupId }).populate(
                "userId",
                "name email avatar"
            ),
        ]);
        const finalAmount = members.map((member) => {
            return {
                user: member.userId._id,
                name: member.userId.name,
                balance: 0,
            };
        });
        const getBalance = (userId) => {
            finalAmount.find() 
        };
    } catch (error) {

        throw error;
    }
};

module.exports = { getGroupBalances };