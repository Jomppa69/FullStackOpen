const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleWare = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.log('Connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB', error.message)
    })

// Middlewares start ######################################################################################
app.use(express.json()) // So server can use JSON efficiently
app.use(cors()) // Allows server to accept requests from different origins (domains).
app.use(express.static('dist')) // Tells server to serve all the static files located in the 'dist' directory
app.use(middleWare.requestLogger)

app.use('api/persons', personsRouter)

app.use(middleWare.unknownEndpoint)
app.use(middleWare.errorHandler)

module.exports = app