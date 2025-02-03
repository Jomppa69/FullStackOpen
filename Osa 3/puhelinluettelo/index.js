require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



// Middlewares start ######################################################################################

// So server can use JSON efficiently
app.use(express.json())

// Used for logging requests to console
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}))

// Allows server to accept requests from different origins (domains).
app.use(cors())

// Tells server to serve all the static files located in the 'dist' directory
app.use(express.static('dist'))




// Endpoints start ######################################################################################

// Homepage
app.get('/', (request, response) => {
    response.send('<h1>Hello World!<h1/>')
})

// Get info
app.get('/info', (request, response, next) => {
    Person.countDocuments()
    .then(result => {
    const responseMessage = `<h2>Phonebook has info for ${result} people</h2> \n ${new Date()}`
    response.send(responseMessage)
    })
    .catch(error => next(error))
    
})

// Get persons
app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get 1 person
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})


// Add person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person =  new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        {name, number},
         {new: true, runValidators: true, context: query}
        )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})


// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Unknown endpoint
app.use(unknownEndpoint)


// Defining errorHandler
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    if(error.name === 'CastError') {
        response.status(400).send({error: 'malformatted id'});
    } else if (error.name === 'ValidationError')
        return response.status(400).json({error: error.message})

    next(error)  
}

// Use the errorhandler for errors
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})