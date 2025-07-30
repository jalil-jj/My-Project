const express = require('express')
const router = express.Router()

const contactController = require('./../../controllers/v1/contact')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')



router
    .route('/')
    .post(contactController.create)                                          // Done
    .get(authMiddleware, isAdminMiddleware, contactController.getAll)        // Done

    router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, contactController.remove)      // Done

    router
    .route('/answer')
    .post(authMiddleware, isAdminMiddleware, contactController.answer)        // Done
 


module.exports = router