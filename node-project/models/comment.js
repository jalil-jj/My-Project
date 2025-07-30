const mongoose = require('mongoose')



const schema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
        required: true
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    isAccept: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        default : 5
    },
    isAnswer: {
        type: Number,
        required: true
    },
    mainCommentID: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }
}, { timestamps: true })


const model = mongoose.model("Comment", schema)


module.exports = model