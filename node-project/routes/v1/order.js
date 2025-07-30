const express = require('express')

const router = express.Router()

const orderController = require('./../../controllers/v1/order')
const authMiddleware = require('./../../middlewares/auth')



router
    .route('/')
    .get(authMiddleware, orderController.getAll)


router
    .route('/:id')
    .get(authMiddleware, orderController.getOne)



module.exports = router