const express = require('express')

const router = express.Router()
const multer = require('multer')
const multerStorage = require('./../../utils/uploader')
const courseController = require('./../../controllers/v1/course')
const authMiddleware = require('./../../middlewares/auth')
const isAdminMiddleware = require('./../../middlewares/isAdmin')


router
    .route('/')
    .post(multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover")     //done
        , authMiddleware, isAdminMiddleware, courseController.create)
    .get(courseController.getAll)                              //done





router
    .route('/sessions')
    .get(authMiddleware, isAdminMiddleware, courseController.getAllSessions)

router
    .route('/sessions/:href')
    .get(courseController.getSessionsOfCourse)


router
    .route('/:href')
    .get(courseController.getOne)

router
    .route('/:id')
    .delete(authMiddleware, isAdminMiddleware, courseController.removeCourse)                      //done
    .put(multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("cover")
        , authMiddleware, isAdminMiddleware, courseController.editCourse)                          // bug

router
    .route('/related/:href')
    .get(courseController.getRelated)

router
    .route('/:id/session')
    .post(multer({ storage: multerStorage, limits: { fileSize: 100000000 } }).single("video")     //done
        , authMiddleware, isAdminMiddleware, courseController.createSession)



router
    .route('/sessions/:id')
    .delete(authMiddleware, isAdminMiddleware, courseController.removeSession)

router
    .route('/:courseID/register')
    .post(authMiddleware, courseController.register)

router
    .route('/category/:href')
    .get(courseController.getCoursesByCategory)



router
    .route('/:href/:sessionID')
    .get(authMiddleware, courseController.getSessionInfo)

router
    .route('/:href/:sessionID/free')
    .get(courseController.getFreeSessions)



module.exports = router