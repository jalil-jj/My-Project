const categoryModel = require('./../../models/category')
const mongoose = require('mongoose')



exports.create = async (req, res) => {

    const { title, href } = req.body;

    const category = await categoryModel.create({
        title, href
    })


    return res.status(201).json({
        message: 'good',
        category
    })
}


exports.getAll = async (req, res) => {
    const categories = await categoryModel.find({}, '-__v')

    res.json(categories)
}


exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid category ID!"
        });
    }

    await categoryModel.findByIdAndDelete(id)

    return res.json({
        message: "Delet category successfully :))"
    })
}


exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, href } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid category ID!"
        });
    }

    const updataCategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        {
            title,
            href
        }
    )

    if (!updataCategory) {
        return res.json({
            message: "Category not found !!!"
        })
    }

    res.json({
        message: "Update category successfully :))"
    })

}