const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Defining errorHandler
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError')
        response.status(400).send({ error: 'malformatted id' })
    else if (error.name === 'ValidationError')
        return response.status(400).json({ error: error.message })
    else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error'))
        return response.status(400).json({ error: 'expected `username` to be unique' })
    next(error)
}

// Defining handling authorization tokens
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        return response.status(401).json({ error: 'Unauthorized' })
    }
    next()
}

// MW for getting user with bearer token
const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id)

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}