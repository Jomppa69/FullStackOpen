const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Person = require('../models/person')

const bcrypt = require('bcrypt')
const User = require('../models/user')


describe('When there is initially some people saved', () => {
    beforeEach(async () => {
        await Person.deleteMany({})
        await Person.insertMany(helper.initialPersons)
    })



    const api = supertest(app)

    test('persons are returned as json', async () => {
        await api
            .get('/api/persons')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('All people are returned', async() => {
        const response = await api.get('/api/persons')
        assert.strictEqual(response.body.length, helper.initialPersons.length)
    })

    test('Specific person is in persons', async () => {
        const response = await api.get('/api/persons')

        const contents = response.body.map(e => e.name)
        assert(contents.includes('jouni'))
    })

    describe('Viewing a specific person', () => {
        test('succeeds with a valid id', async () => {
            const personsAtStart = await helper.personsInDb()

            const personToView = personsAtStart[0]

            const resultPerson = await api
                .get(`/api/persons/${personToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultPerson.body, personToView)
        })

        test('fails with statuscode 404 if person doesnt exist', async () => {
            const validNonexistingId = await helper.nonExistingId()

            await api
                .get(`/api/persons/${validNonexistingId}`)
                .expect(404)
        })

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '4dasda13542363'

            await api
                .get(`/api/persons/${invalidId}`)
                .expect(400)
        })
    })

    describe('addition of a person', () => {
        test('succeeds with valid data', async () => {
            const newPerson = {
                'name': 'tarja',
                'number': '44-555444',
            }

            await api
                .post('/api/persons')
                .send(newPerson)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/persons')

            const contents = response.body.map(r => r.name)

            assert.strictEqual(response.body.length, helper.initialPersons.length + 1)

            assert(contents.includes('tarja'))
        })

        test('fails with statuscode 400 if data is invalid', async () => {
            const newPerson = {
                'number': '12-3456789'
            }

            await api
                .post('/api/persons')
                .send(newPerson)
                .expect(400)

            const response = await api.get('/api/persons')
            assert.strictEqual(response.body.length, helper.initialPersons.length)
        })
    })

    describe('deletion of a person', () => {
        test('succeed with statuscode 204 if id is valid', async () => {
            const personsAtStart = await helper.personsInDb()

            const personToDelete = personsAtStart[0]

            await api
                .delete(`/api/persons/${personToDelete.id}`)
                .expect(204)

            const personsAtEnd = await helper.personsInDb()

            const contents = personsAtEnd.map(r => r.name)
            assert(!contents.includes(personToDelete.name))

            assert.strictEqual(personsAtEnd.length, helper.initialPersons.length - 1)
        })

        test('fails with statuscode 404 if id is invalid', async () => {
            const invalidId = '4dasda13542363'

            await api
                .delete(`/api/persons/${invalidId}`)
                .expect(400)
        })
    })
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    const api = supertest(app)


    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })


    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

})

after(async () => {
    await mongoose.connection.close()
})