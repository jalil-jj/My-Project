const courseModel = require('./../../models/course')

exports.getAll = async (req, res) => {
    const { keyWord } = req.params;

    const courses = await courseModel.find({
        name: { $regex: ".*" + keyWord + ".*" }
    })


    return res.json(courses)
}