const mongoose = require("mongoose");

const groupMemberSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        }
    },
    {
        timestamps: true
    }
);

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

module.exports = GroupMember;