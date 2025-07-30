const express = require('express')

const router = express.Router()

const newsLetterController = require('./../../controllers/v1/newsLetter')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')



router
    .route('/')
    .get(authMiddleware, isAdminMiddleware, newsLetterController.getAll)
    .post(newsLetterController.create)

router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, newsLetterController.remove)



module.exports = router