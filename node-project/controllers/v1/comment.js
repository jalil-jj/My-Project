const mongoose = require('mongoose')
const commentModel = require('./../../models/comment')
const courseModel = require('./../../models/course')



exports.create = async (req, res) => {
    const { body, score, coursehref } = req.body;

    const course = await courseModel.findOne({ href: coursehref }).lean()

    const comment = await commentModel.create({
        body,
        course: course._id,
        creator: req.user._id,
        isAccept: 0,
        score,
        isAnswer: 0
    })

    res.status(201).json(comment)

}

exports.getAll = async (req, res) => {
    const comments = await commentModel.find({})
        .populate("course")
        .populate("creator", "-password")
        .lean()

    let allComments = [];

    comments.forEach(comment => {
        if (!comment.mainCommentID) {
            const replies = comments.filter(reply => {
                return String(reply.mainCommentID) === String(comment._id);
            });

            allComments.push({
                ...comment,
                course: comment.course?.name,
                creator: comment.creator?.name,
                replies: replies.map(reply => ({
                    ...reply,
                    course: reply.course?.name,
                    creator: reply.creator?.name
                }))
            });
        }
    });


    res.json(allComments)
}

exports.remove = async (req, res) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isIdValid) {
        return res.status(409).json({
            message: "This Id is not valid !!!"
        })
    }
    const deleteComment = await commentModel.findOneAndDelete({ _id: req.params.id })

    if (!deleteComment) {
        return res.status(422).json({
            message: "This comment not found !!!"
        })
    }

    return res.json({
        message: "Delete comment successfully :))",
        deleteComment
    })
}

exports.accept = async (req, res) => {

    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isIdValid) {
        return res.status(409).json({
            message: "This Id is not valid !!!"
        })
    }

    const acceptComment = await commentModel.findByIdAndUpdate(
        { _id: req.params.id },
        { isAccept: 1 }
    )

    if (!acceptComment) {
        return res.status(409).json({
            message: "This comment is not found !!!"
        })
    }

    return res.json({
        message: "Comment accept successfully :))",
        acceptComment
    })
}

exports.reject = async (req, res) => {
    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isIdValid) {
        return res.status(409).json({
            message: "This Id is not valid !!!"
        })
    }

    const rejectComment = await commentModel.findByIdAndUpdate(
        { _id: req.params.id },
        { isAccept: 0 }
    )

    if (!rejectComment) {
        return res.status(409).json({
            message: "This comment is not found !!!"
        })
    }

    return res.json({
        message: "Comment reject successfully :))",
        rejectComment
    })
}

exports.answer = async (req, res) => {
    const { body } = req.body;

    const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isIdValid) {
        return res.status(409).json({
            message: "This Id is not valid !!!"
        })
    }


    const acceptedComment = await commentModel.findOneAndUpdate(
        { _id: req.params.id },
        { isAccept: 1 }
    )

    if (!acceptedComment) {
        return res.status(409).json({
            message: "This comment not founded !!!"
        })
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course,
        creator: req.user._id,
        isAccept: 1,
        isAnswer: 1,
        mainCommentID: req.params.id
    })

    return res.json({
        message: "Answer comment successfully :))",
        answerComment
    })
}