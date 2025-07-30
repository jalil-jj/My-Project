const jwt = require('jsonwebtoken')
const userModel = require('./../models/user')

module.exports = async (req, res, next) => {
    const authHeader = req.header("Authorization")?.split(" ")

    if (authHeader?.length !== 2) {
        return res.status(403).json({
            message: "This route is protect and you can,t have access to this route !"
        })
    }

    const token = authHeader[1];

    try {

        const jwtPyload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(jwtPyload.id).lean()
        Reflect.deleteProperty(user, "password")

        req.user = user

        next()

    } catch (error) {
        res.status(401).json({ message: "Unauthorized access" });
    }

}