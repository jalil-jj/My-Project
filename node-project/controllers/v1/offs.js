const offsModel = require('./../../models/offs')
const courseModel = require('./../../models/course')
const mongoose = require('mongoose')


exports.getAll = async (req, res) => {
    const offs = await offsModel.find({}, "-__v")
        .populate("course", 'name')
        .populate("creator", "name")

    return res.json(offs)
}

exports.create = async (req, res) => {
    const { code, percent, max, course } = req.body;

    const off = await offsModel.create({
        code,
        percent,
        max,
        course,
        creator: req.user._id
    })

    return res.status(201).json(off)
}

exports.setOnAll = async (req, res) => {
    const { discount } = req.body;

    const coursesDiscount = await courseModel.updateMany({}, { discount })

    return res.json({
        message: "Discount Courses Successfully :))",
    })
}

exports.getOne = async (req, res) => {
    const { code } = req.params;
    const { course } = req.body;

    if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.json({
            message: "This ID is not valid :))"
        })
    }

    const off = await offsModel.findOne({ code, course })

    if (!off) {
        return res.json({
            message: "This Code is not valid !!!"
        })
    } else if (off.max === off.user) {
        return res.json({
            message: "This Code already useed !!!"
        })
    } else {
        await offsModel.findOneAndUpdate(
            { code, course },
            { user: off.user + 1 }
        )

        return res.json(off)
    }

}

exports.remove = async (req, res) => {
    const { id } = req.params;

    const offs = await offsModel.findByIdAndDelete(id)

    return res.json({
        message: "Delete Offs Successfully :))",
        offs
    })

}
