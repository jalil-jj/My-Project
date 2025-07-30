const contactModel = require('./../../models/contact')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')



exports.create = async (req, res) => {
    const { name, email, phone, body } = req.body;

    const contact = await contactModel.create({
        name,
        email,
        phone,
        body,
        answer: 0
    })

    res.status(201).json(contact)
}

exports.getAll = async (req, res) => {
    const contacts = await contactModel.find({}).lean()

    return res.json(contacts)
}

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(409).json({
            message: "This ID is not valid !!!"
        })
    }

    const deleteContact = await contactModel.findByIdAndDelete(id)

    if (!deleteContact) {
        return res.status(404).json({
            message: "This contact not found !!!"
        })
    }

    return res.json({
        message: "Delete contact successfuly :)))",
        deleteContact
    })

}

exports.answer = async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "y9954386@gmail.com",
            pass: "aqofaarnawvslcpw"
        }
    })

    const mailOptions = {
        from: "y9954386@gmail.com",
        to: req.body.email,
        subject: "پاسخ به کامنت شما از سمت بکند کار پروژه",
        text: req.body.answer
    }

    console.log(req.body.answer);

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            return res.json(
                { message: error }
            )
        } else {
            const contact = await contactModel.findOneAndUpdate(
                { email: req.body.email },
                { answer: 1 }
            )

            return res.status(201).json({ message: "Answer contact successfully :))" })
        }
    })

}