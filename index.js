const express = require('express')
const cors = require('cors')

const errorHandler = require('./middlewares/errorHandler')
const authentication = require('./middlewares/authentication')
const authController = require('./controllers/auth')
const userController = require('./controllers/user')
const categoryController = require('./controllers/category')
const articleController = require('./controllers/article')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(errorHandler)
app.use('/auth', authController)
app.use('/user', authentication, userController)
app.use('/category', authentication, categoryController)
app.use('/article', authentication, articleController)


app.listen(port, () => {
    console.log(`Servidor node rodando na porta ${port}`)
})