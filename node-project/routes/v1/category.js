const express = require('express')
const router = express.Router()
const categoryController = require('./../../controllers/v1/category')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')

router
    .route('/')
    .post(authMiddleware, isAdminMiddleware, categoryController.create)     // Done
    .get(categoryController.getAll)                                         // Done

router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, categoryController.remove)   // Done
    .put(authMiddleware, isAdminMiddleware, categoryController.update)      // Done



module.exports = router