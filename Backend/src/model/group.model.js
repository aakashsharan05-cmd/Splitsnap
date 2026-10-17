const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        alertLimit: {
            type: Number,
            default: 1000
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        icon: {
            type: String,
            default: "👥"
        }
    },

    {
        timestamps: true
    }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;