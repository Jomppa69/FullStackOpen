const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

const getToken = async () => {
    const response = await api
        .post('/api/login')
        .send({ username: 'blogTestUser', password: 'sekret' })
    return response.body.token
}


describe('Bloglist', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'blogTestUser', passwordHash })

        await user.save()

        token = await getToken()
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are three blogs', async() => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('The first blogs author is "Janne"', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

        const contents = response.body.map(e => e.author)
        assert(contents.includes('Janne'))
    })

    test('Blogs have an id field', async () => {
        const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
        response.body.forEach(blog => {
            assert(blog.id)
        })
    })

    describe('Adding blogs', () => {
        test('A valid blog can be added', async() => {
            const newBlog = {
                'title': 'Lisätty blogi',
                'author': 'Seppo',
                'url': 'ei mikään',
                'likes': 10,
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
            const contents = await response.body.map(r => r.author)
            assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
            assert(contents.includes('Seppo'))
        })

        test('Make likes 0 if added blog doesnt include any likes', async() => {
            const newBlog = {
                'title': 'Ei tykkäyksiä',
                'author': 'Seppo',
                'url': 'ei mikään',
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
            const contents = await response.body.find((blog) => blog.title === 'Ei tykkäyksiä')
            assert.strictEqual(contents.likes, 0)
        })

        test('Blog without title or author is not added', async () => {
            const newBlog = {
                'url': 'ei mikään',
                'likes': null,
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('Returns 401 unauthorized if request doesnt include token', async () => {
            const newBlog = {
                'title': 'Lisätty blogi',
                'author': 'Seppo',
                'url': 'ei mikään',
                'likes': 10,
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)
            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })
    })




    describe('Deletion of a blog', () => {
        let blogToDelete = {
            'title': 'blog to delete',
            'author': 'fakeblogger',
            'url': 'ei mikään',
        }
        beforeEach(async () => {
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(blogToDelete)
        })

        test('Succeed with statuscode 204, if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            blogToDelete = blogsAtStart[3]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            const contents = blogsAtEnd.map(r => r.author)
            assert(!contents.includes(blogToDelete.author))
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
        })

        test('Fails with statuscode 403 if id is invalid', async () => {
            const invalidId = '4562465247524'

            await api
                .delete(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(403)
        })
    })



    describe('Modifying of a blog', () => {
        test('Succeed with valid id and contents', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToModify = blogsAtStart[0]

            const updatedBlog = {
                ...blogToModify,
                title: 'Updated Title',
                likes: blogToModify.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToModify.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            const modifiedBlog = blogsAtEnd.find(blog => blog.id === blogToModify.id)

            assert.strictEqual(modifiedBlog.title, 'Updated Title')
            assert.strictEqual(modifiedBlog.likes, blogToModify.likes + 1)
        })

        test('Fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '4562465247524'
            const updatedBlog = {
                title: 'Updated Title',
                author: 'Unknown',
                url: 'unknown',
                likes: 0
            }

            await api
                .put(`/api/blogs/${invalidId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlog)
                .expect(400)
        })

        test('Fails with statuscode 400 if data is invalid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToModify = blogsAtStart[0]

            const updatedBlog = {
                ...blogToModify,
                title: '',
                author: '',
                url: '',
                likes: blogToModify.likes + 1
            }

            await api
                .put(`/api/blogs/${blogToModify.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBlog)
                .expect(400)

        })
    })
})

after(async () => {
    await mongoose.connection.close()
})