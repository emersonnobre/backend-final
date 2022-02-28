const express = require('express')
const cors = require('cors')

const errorHandler = require('./middlewares/errorHandler')
const userController = require('./controllers/user')
const categoryController = require('./controllers/category')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
app.use(errorHandler)
app.use('/user', userController)
app.use('/category', categoryController)


app.listen(port, () => {
    console.log(`Servidor node rodando na porta ${port}`)
})