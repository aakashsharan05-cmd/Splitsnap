const GroupMember = require("../model/group.member.model");
const Settlement = require("../model/settlement.model");
const Expense = require("../model/expense.model");

const getGroupBalances = async (groupId) => {
 
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
            return finalAmount.find(
                (item) => item.user.toString() === userId.toString()
            );
        };
        for (const expense of expenses) {
            // Step A: expense ka payer nikalo
            const payerId = expense.paidBy           
            const payerBalance = getBalance(payerId);
            payerBalance.balance += Number(expense.amount);
            for (const split of expense.splits) {
                const memberBalance = getBalance(split.user);
                memberBalance.balance -= Number(split.amount);
            }

        }
        for (const settlement of settlements) {

            const fromuser = settlement.from
            const fromuserBalance = getBalance(fromuser)

            const touser = settlement.to
            const touserBalance = getBalance(touser)

            const amount = settlement.amount

            fromuserBalance.balance += Number(amount);

            touserBalance.balance -= Number(amount);
        }
        return finalAmount
   
};

module.exports = { getGroupBalances };