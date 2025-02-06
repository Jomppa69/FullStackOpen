const personsRouter = require('express').Router()
const Person = require('../models/person')

// Get info
personsRouter.get('/info', async (request, response) => {
    const result = await Person.countDocuments()
    const responseMessage = `<h2>Phonebook has info for ${result} people</h2> \n ${new Date()}`
    response.send(responseMessage)
})

// Get persons
personsRouter.get('/', async (request, response) => {
    const persons = await Person.find({})
    response.json(persons)
})

// Get 1 person
personsRouter.get('/:id', async (request, response) => {
    const person = await Person.findById(request.params.id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


// Add person
personsRouter.post('/',  async (request, response) => {
    const body = request.body
    const person =  new Person({
        name: body.name,
        number: body.number,
    })
    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
})

personsRouter.put('/:id', async (request, response) => {
    const { name, number } = request.body
    const updatedPerson = await Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedPerson)
})


// Delete person
personsRouter.delete('/:id', async (request, response) => {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = personsRouter