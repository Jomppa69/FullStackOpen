const Person = require('../models/person')

const initialPersons = [
    {
        'name': 'jouni',
        'number': '021-1111111',
    },
    {
        'name': 'jenna',
        'number': '44-3424244',
    },
    {
        'name': 'seppo',
        'number': '434-555444',
    }
]

const nonExistingId = async () => {
    const person = new Person({
        'name': 'olematon',
        'number': '12-345678' })
    await person.save()
    await person.deleteOne()

    return person._id.toString()
}

const personsInDb = async () => {
    const persons = await Person.find({})
    return persons.map(person => person.toJSON())
}

module.exports = {
    initialPersons, nonExistingId, personsInDb
}