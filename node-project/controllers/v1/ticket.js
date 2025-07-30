const ticketsModel = require('./../../models/ticket')
const departmentsModel = require('./../../models/department')
const departmentsSubModel = require('./../../models/departmenr-sub')


exports.getAll = async (req, res) => {
    const tickets = await ticketsModel.find({ answer: 0, isAnswer: 0 }, "-__v")
        .populate("user", "name")
        .populate("DepartmentID", "title")
        .populate("DepartmentSubID", "title")
        .lean()

        console.log(tickets);

    return res.json(tickets)
}

exports.create = async (req, res) => {
    const { DepartmentID, DepartmentSubID, priority, title, body } = req.body
    const covers = req.files?.map(file => file.filename);


    const ticket = await ticketsModel.create({
        DepartmentID,
        DepartmentSubID,
        priority,
        title,
        covers,
        body,
        user: req.user._id,
        answer: 0,
        isAnswer: 0
    })


    const mainTicket = await ticketsModel.findOne({ _id: ticket._id })
        .populate("DepartmentID")
        .populate("DepartmentSubID")
        .populate("user", "name")
        .lean()

    console.log(mainTicket);

    return res.status(201).json(mainTicket)
}

exports.remove = async (req, res) => {
    const { id } = req.params;

    const ticket = await ticketsModel.findByIdAndDelete(id)

    return res.json({
        message: "Delete Offs Successfully :))",
        ticket
    })

}

exports.userTickets = async (req, res) => {
    const tickets = await ticketsModel.find({ user: req.user._id })
        .sort({ _id: -1 })
        .populate("DepartmentID", "title")
        .populate("DepartmentSubID", "title")
        .populate("user", "name")

    return res.json(tickets)
}

exports.departments = async (req, res) => {
    const departments = await departmentsModel.find({})

    return res.json(departments)
}

exports.departmentsSubs = async (req, res) => {
    const departmentSub = await departmentsSubModel.find({
        parent: req.params.id
    })

    return res.json(departmentSub)
}

exports.setAnswer = async (req, res) => {
    const { body, ticketID } = req.body;

    const ticket = await ticketsModel.findOne({ _id: ticketID })

    const answer = await ticketsModel.create({
        title: "پاسخ تیکت کاربر",
        body,
        DepartmentID: ticket.DepartmentID,
        priority: ticket.priority,
        DepartmentSubID: ticket.DepartmentSubID,
        user: req.user._id,
        answer: 0,
        isAnswer: 1,
        parent: ticket._id
    })

    await ticketsModel.findOneAndUpdate(
        { _id: ticketID },
        { answer: 1 }
    )

    res.status(201).json(answer)
}

exports.getAnswer = async (req, res) => {
    const { id } = req.params;

    const ticket = await ticketsModel.findOne({ _id: id })
        .populate("user", "name");

    const ticketAnswer = await ticketsModel.findOne({ parent: id })
        .populate("user", "name");

    return res.json({
        ticket,
        ticketAnswer
    });
};

