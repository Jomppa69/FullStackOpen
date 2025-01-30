const express = require('express')
const app = express()
const morgan = require('morgan')


// Middlewares start
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }


morgan.token('body', (req) => JSON.stringify(req.body))

app.use(express.json())
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


// Endpoints start
app.get('/', (request, response) => {
    response.send('<h1>Hello World!<h1/>')
})

// Get info
app._router.get('/info', (request, response) => {
    const responseMessage = `<h2>Phonebook has info for ${persons.length} people</h2> \n ${new Date()}`
    response.send(responseMessage)
})

// Get persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Get 1 person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})


// Add person
app.post('/api/persons', (request, response) => {
const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'name or number is missing' 
        })
    }

    if(persons.find(person => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const generateId = () => {
    let newId;
    do {
        newId = String(Math.floor(Math.random() * 10000));
    } while (persons.find(person => person.id === newId));
    return newId;
}


// Delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personToDelete = persons.find(person => person.id === id)

    persons = persons.filter(person => person !== personToDelete)
    response.status(204).end()
    })

    const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


// Unknown endpoint
app.use(unknownEndpoint)



let persons = [
          {
            "id": "1",
            "name": "matti",
            "number": "444"
          },
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})