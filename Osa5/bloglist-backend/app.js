const  config  = require('./utils/config')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)
logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Connected to MongoDB')
    })
    .catch(error => {
        logger.error('Error connecting to MongoDB', error.message)
    })

// Middlewares
app.use(express.json())
app.use(cors())
//app.use(express.static('dist'))
if (!(process.env.NODE_ENV === 'test')) app.use(middleware.requestLogger)

app.use('/api/blogs',middleware.tokenExtractor ,middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app