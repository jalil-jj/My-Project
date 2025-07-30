const notificationModel = require('./../../models/notification')

exports.create = async (req, res) => {
    const { message, admin } = req.body;
    
    const notification = await notificationModel.create({ message, admin })
    
    return res.status(201).json(notification)
}

exports.getAll = async (req, res) => {
    const notifications = await notificationModel
        .find({})
        .populate('admin', 'name email')


    return res.json(notifications)
}

exports.getNotif = async (req, res) => {
    const { _id } = req.user

    const notification = await notificationModel.find({
        admin: _id
    })

    return res.json(notification)
}

exports.seen = async (req, res) => {
    const { id } = req.params ; 

    const notification = await notificationModel.findOneAndUpdate(
        {_id : id} , 
        {seen : 1}
    )

    return res.json(notification)
}

exports.remove = async (req, res) => {
    const { id } = req.params ; 

    const notification = await notificationModel.findByIdAndDelete(id)

    return res.json(notification)
}