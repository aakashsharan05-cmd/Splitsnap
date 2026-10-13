
const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },
        description: {
            type: String

        },
        amount: {
            type: Number,
            required: true

        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category: {
            type: String

        },
        splitType: {
            type: String,
            enum: ["equal", "percentage", "exact"],
            default: "equal"
        },
        splits: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                amount: {
                    type: Number
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;