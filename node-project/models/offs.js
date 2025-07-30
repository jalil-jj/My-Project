const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    percent: {
        type: Number,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true
    },
    max: {
        type: Number,
        required: true
    },
    user: {
        type: Number,
        required: true,
        default : 0
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const model = mongoose.model("Offs", schema)

module.exports = model