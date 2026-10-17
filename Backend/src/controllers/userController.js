
const User = require("../model/user.model");

const searchUser = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        if (!search) {
            return res.status(400).json({
                message: "Please provide a search term.",
            });
        }

        const users = await User.find({
            _id: { $ne: req.user.userId },
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        })
            .select("_id name email avatar")
            .limit(10);

        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = searchUser ;
