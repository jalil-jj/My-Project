const express = require('express')
const router = express.Router()

const commentController = require('./../../controllers/v1/comment')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')





router
    .route('/')
    .post(authMiddleware, commentController.create)                         // Done
    .get(authMiddleware, isAdminMiddleware, commentController.getAll)       // Done

router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, commentController.remove)    // Done

router
    .route('/:id/accept')
    .put(authMiddleware, isAdminMiddleware, commentController.accept)       // Done

router
    .route('/:id/reject')
    .put(authMiddleware, isAdminMiddleware, commentController.reject)       // Done

router
    .route('/:id/answer') 
    .post(authMiddleware, isAdminMiddleware, commentController.answer)      // Done




module.exports = router