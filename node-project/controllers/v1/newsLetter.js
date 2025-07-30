const newsLetterModel = require('./../../models/newsLetter')



exports.getAll = async (req, res) => {
    const newsLetters = await newsLetterModel.find({})


    return res.json(newsLetters)
}


exports.create = async (req, res) => {
    const { email } = req.body;

    const newsLetter = await newsLetterModel.create({ email })

    return res.json(newsLetter)
}


const mongoose = require('mongoose');

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'شناسه معتبر نیست.' });
    }

    const newsLetter = await newsLetterModel.findByIdAndDelete(id);

    if (!newsLetter) {
        return res.status(404).json({ message: 'عضو خبرنامه پیدا نشد.' });
    }

    return res.status(200).json({
        message: 'عضو خبرنامه با موفقیت حذف شد.',
        data: newsLetter
    });
};
