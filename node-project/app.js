const express = require('express')
const app = express()

const authRouter = require('./routes/v1/auth')
const userRouter = require('./routes/v1/user')
const categoriesRouter = require('./routes/v1/category')
const coursesRouter = require('./routes/v1/course')
const commentsRouter = require('./routes/v1/comment')
const contactRouter = require('./routes/v1/contact')
const newsLetterRouter = require('./routes/v1/newsLetter')
const searchRouter = require('./routes/v1/search')
const notificationRouter = require('./routes/v1/notification')
const offsRouter = require('./routes/v1/offs')
const ordersRouter = require('./routes/v1/order')
const ticketsRouter = require('./routes/v1/ticket')
const departmentsRouter = require('./routes/v1/department')
const departmentsSubRouter = require('./routes/v1/department-sub')
const menuRouter = require('./routes/v1/menu')
const articleRouter = require('./routes/v1/articles')



const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')


app.use('/courses/covers', express.static(path.join(__dirname, "public", "courses", "covers")))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/v1/auth', authRouter)
app.use('/v1/users', userRouter)
app.use('/v1/category', categoriesRouter)
app.use('/v1/courses', coursesRouter)
app.use('/v1/comments', commentsRouter)
app.use('/v1/contact', contactRouter)
app.use('/v1/newsLetter', newsLetterRouter)
app.use('/v1/search', searchRouter)
app.use('/v1/notification', notificationRouter)
app.use('/v1/offs', offsRouter)
app.use('/v1/orders', ordersRouter)
app.use('/v1/tickets', ticketsRouter)
app.use('/v1/department', departmentsRouter)
app.use('/v1/department-sub', departmentsSubRouter)
app.use('/v1/menus', menuRouter)
app.use('/v1/article', articleRouter)


module.exports = app