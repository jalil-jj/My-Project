const courseUserModel = require('./../../models/course-user')
const mongoose = require('mongoose')



exports.getAll = async (req, res) => {
    const orders = await courseUserModel.find({ user: req.user._id } , '-__v')
        .populate("course", "name href status")
        .lean()

    return res.json(orders)
}

exports.getOne = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Id is not valid !!!"
        })
    }

    const order = await courseUserModel.findOne({ _id: id })
        .populate("course", "name href")
        .lean()

    return res.json(order)

}