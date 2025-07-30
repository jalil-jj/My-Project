const express = require('express')

const router = express.Router()

const notificationController = require('./../../controllers/v1/notification')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')


router
    .route('/')
    .post(authMiddleware, isAdminMiddleware, notificationController.create)
    .get(authMiddleware, isAdminMiddleware, notificationController.getAll)

router
    .route('/admin')
    .get(authMiddleware, isAdminMiddleware, notificationController.getNotif)

router
    .route('/:id/see')
    .put(authMiddleware, isAdminMiddleware, notificationController.seen)

router
    .route('/:id/delete')
    .delete(authMiddleware, isAdminMiddleware, notificationController.remove)


module.exports = router