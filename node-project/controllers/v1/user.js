const userModel = require('./../../models/user')
const banUserModel = require('./../../models/ban-user')
const mongoose = require('mongoose')
const registerValidator = require('../../validators/validator')
const bcrypt = require('bcrypt')



exports.getAll = async (req, res) => {
    const users = await userModel.find({}, '-password');

    return res.json(users)
}

exports.banUser = async (req, res) => {

    const mainUser = await userModel.findOne({ _id: req.params.id }).lean()

    const banUserResult = await banUserModel.create({
        phone: mainUser.phone
    })

    if (banUserResult) {
        return res.status(200).json({
            message: "Ban User Successfully :))"
        })
    }

    return res.status(500).json({
        message: "Error Server !!! :))"
    })
}

exports.removeUser = async (req, res) => {
    const { id } = req.params


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid user ID!"
        });
    }


    const result = await userModel.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
        return res.status(404).json({
            message: "User not found!"
        });
    }

    return res.json({
        message: "Delete user successfully : ))"
    })
}

exports.changeRole = async (req, res) => {
    const { id } = req.body


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid user ID!"
        });
    }

    const user = await userModel.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }


    const userRole = user.role === "ADMIN" ? "USER" : "ADMIN"

    const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { role: userRole },
        { new: true }
    )

    if (updatedUser) {
        return res.json({
            message: "Change role successfully : ))",
        })
    }

}

//  Users Change Own Informations

exports.updateUser = async (req, res) => {
    try {
        const { name, username, email, password, phone } = req.body;

        const updateFields = { name, username, email, phone };

        if (password && password.trim() !== '') {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            updateFields,
            { new: true }  // برگرداندن نسخه به‌روز شده
        ).lean();

        // حذف پسورد قبل از ارسال
        if (user) {
            delete user.password;
        }

        return res.json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "خطای سرور" });
    }
}


//  Admin Change Users Informations

exports.editUser = async (req, res, next) => {
    try {
        const { name, username, email, password, phone } = req.body;
        const { id } = req.params;


        const hashedPassword = password
            ? await bcrypt.hash(password, 12)
            : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                name,
                username,
                email,
                password: hashedPassword,
                phone
            },
            { new: true }
        );

        return res.json({ user: updatedUser });
    } catch (error) {
        console.error("❌ خطا در editUser:", error);
        res.status(error.statusCode || 500).json({ message: error.message || "خطای داخلی سرور" });
    }
}