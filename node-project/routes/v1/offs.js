const express = require('express')

const router = express.Router()

const offsController = require('./../../controllers/v1/offs')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')




router
    .route('/')
    .get(authMiddleware, isAdminMiddleware,offsController.getAll)
    .post(authMiddleware, isAdminMiddleware,offsController.create)


router
    .route('/all')
    .post(authMiddleware, isAdminMiddleware,offsController.setOnAll)



router
    .route('/:code')
    .post(authMiddleware,offsController.getOne)



router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware,offsController.remove)





module.exports = router