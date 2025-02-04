const personsRouter = require('express').Router()
const Person = require('../models/person')

// Get info
personsRouter.get('/info', (request, response, next) => {
    Person.countDocuments()
        .then(result => {
            const responseMessage = `<h2>Phonebook has info for ${result} people</h2> \n ${new Date()}`
            response.send(responseMessage)
        })
        .catch(error => next(error))

})

// Get persons
personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Get 1 person
personsRouter.get('/:id', (request, response, next) => {
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
personsRouter.post('/', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


// Delete person
personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = personsRouter