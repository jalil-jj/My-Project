const userModel = require('../../models/user')
const courseUserModel = require('../../models/course-user')
const notificationsModel = require('../../models/notification')

const registerValidator = require('../../validators/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const banUserModel = require('./../../models/ban-user')



exports.register = async (req, res) => {
    const validatorsResult = registerValidator(req.body)

    if (validatorsResult !== true) {
        return res.status(422).json(validatorsResult)
    }

    const { name, username, email, phone, password } = req.body

    const isUserExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserExist) {
        return res.status(409).json({
            message: "username or email is duplicated :))"
        })
    }

    const isUserBan = await banUserModel.find({ phone })

    if (isUserBan.length) {
        return res.status(409).json({
            message: "This Usre Is Ban !"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const countOfUsers = await userModel.countDocuments();


    const user = await userModel.create({
        name,
        username,
        email,
        phone,
        image: req.file.filename,
        password: hashedPassword,
        role: countOfUsers > 0 ? "USER" : "ADMIN"
    })

    const userObject = user.toObject()
    Reflect.deleteProperty(userObject, 'password')

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30 day'
    })

    return res.status(201).json({ user: userObject, accessToken })

}

exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
        return res.status(401).json({
            message: "This is no user with this email or username!"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Password is not valid!"
        });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    res.status(200).json({
        accessToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role
        }
    });
};


exports.getMe = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "احراز هویت انجام نشده است!" });
        }

        const userCourses = await courseUserModel
            .find({ user: req.user._id })
            .populate("course");

        const courses = userCourses.map((uc) => uc.course);

        const adminNotifications = await notificationsModel.find({
            admin: req.user._id,
        });

        const notifications = adminNotifications
            .filter((n) => n.seen === 0)
            .map((n) => ({ msg: n.msg, _id: n._id }));

        const { _id, name, email, username, role, phone, image } = req.user;

        return res.json({
            user: { _id, name, email, username, role, phone, image },
            courses,
            notifications
        });

    } catch (error) {
        next(error);
    }
}

