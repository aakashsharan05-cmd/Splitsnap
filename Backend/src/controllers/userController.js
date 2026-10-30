
const User = require("../model/user.model");

const searchUser = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        if (!search) {
            return res.status(400).json({
                message: "Please provide a search term.",
            });
        }
        if (typeof search !== "string" || search.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }

        if (search.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search term is too long",
            });
        }
        const escapeRegex = (value) => {
            return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        };
        const searchTerm = escapeRegex(search.trim());

        const users = await User.find({
            _id: { $ne: req.user.userId },
            $or: [
                { name: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ],
        });

        return res.status(200).json({ users });
    } catch  {
        return res.status(500).json({
            message: "Server error",
           
        });
    }
};

module.exports = searchUser;
