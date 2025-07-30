const mongoose = require('mongoose')


const chema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
}, { timestamps: true })


const model = mongoose.model("NewsLetter", chema)


module.exports = model