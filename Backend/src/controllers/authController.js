const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        const isUserExist = await User.findOne({
            email
        });

        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hash,
            avatar
        });

        return res.status(201).json({
            message: "Registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });


    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExist = await User.findOne({
            email
        });
        if (userExist) {
            const pass = await bcrypt.compare(password, userExist.password);
            if (pass) {
                const token = jwt.sign(
                    { userId: userExist._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                return res.status(200).json({
                    message: "Login successful",
                    token
                });
            }
            else {
                return res.status(401).json({
                    message: "Incorrect password"
                });
            }

        } else {
            return res.status(400).json({
                message: "User did not  exists"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }

}
module.exports = { registerUser, loginUser };