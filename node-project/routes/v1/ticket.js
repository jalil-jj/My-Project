const express = require('express')
const router = express.Router()
const ticketController = require('./../../controllers/v1/ticket')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')
const multer = require('multer')
const multerStorage = require('./../../utils/uploader')


router
    .route('/')
    .get(authMiddleware, isAdminMiddleware, ticketController.getAll)        // Done
    .post(
         multer({ storage: multerStorage, limits: { fileSize: 10000000 } }).array('covers', 5),
         authMiddleware, ticketController.create)

router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, ticketController.remove)       // Done


router
    .route('/user')
    .get(authMiddleware, ticketController.userTickets)

router
    .route('/departments')
    .get(ticketController.departments)

router
    .route('/departments/:id/subs')
    .get(ticketController.departmentsSubs)

router
    .route('/answer')
    .post(authMiddleware, isAdminMiddleware, ticketController.setAnswer)      // Done

router
    .route('/:id/answer')
    .get(authMiddleware, isAdminMiddleware, ticketController.getAnswer)



module.exports = router