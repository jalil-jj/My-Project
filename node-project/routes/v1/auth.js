const express = require('express')

const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')
const multer = require('multer')
const multerStorage = require('./../../utils/uploader')

const router = express.Router()

const controller = require('../../controllers/v1/auth')


router
    .route('/register')
    .post(multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("image")     //done
        , controller.register)

router
    .post('/login', controller.login)

router
    .get('/me', authMiddleware, controller.getMe)


module.exports = router

