const express = require('express')
const router = express.Router()
const departmentsSubController = require('./../../controllers/v1/department-sub')

const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')



router
.route('/')
.post(authMiddleware,isAdminMiddleware,departmentsSubController.create)




module.exports = router