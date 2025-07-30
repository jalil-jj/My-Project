const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    DepartmentID: {
        type: mongoose.Types.ObjectId,
        ref: "Department",
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    DepartmentSubID: {
        type: mongoose.Types.ObjectId,
        ref: "DepartmentSub",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    covers: {
        type: [String],
        required: false
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    answer: {
        type: Number,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: false
    },
    isAnswer: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Ticket",
        required: false
    }
}, { timestamps: true })


const model = mongoose.model("Ticket", schema)

module.exports = model