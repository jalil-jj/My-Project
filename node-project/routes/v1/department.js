const express = require('express')
const router = express.Router()
const departmentsController = require('./../../controllers/v1/department')

const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')



router
.route('/')
.post(authMiddleware,isAdminMiddleware,departmentsController.create)




module.exports = router