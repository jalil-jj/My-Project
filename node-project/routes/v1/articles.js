const express = require('express')
const multer = require('multer')
const multerStorage = require('./../../utils/uploader')

const router = express.Router()

const articlesController = require('./../../controllers/v1/articles')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')


router
    .route('/')
    .get(articlesController.getAll)
    .post(
        authMiddleware,
        isAdminMiddleware,
        multer({ storage: multerStorage, limits: { fileSize: 10000000 } }).array('covers', 5),
        articlesController.create)

router
    .route('/:href')
    .get(articlesController.getOne)


router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, articlesController.remove)

router
    .route('/draft')
    .delete(
        authMiddleware,
        isAdminMiddleware,
        multer({ storage: multerStorage, limits: { fileSize: 10000000 } }).single('cover'),
        articlesController.saveDraft)



module.exports = router