const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

const api = supertest(app)

describe('Bloglist', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('There are three blogs', async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('The first blogs author is "Janne"', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(e => e.author)
        assert(contents.includes('Janne'))
    })

    test('Blogs have an id field', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert(blog.id)
        })
    })

    test('A valid blog can be added', async() => {
        const newBlog = {
            'title': 'Lisätty blogi',
            'author': 'Seppo',
            'url': 'ei mikään',
            'likes': 10,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const contents = await response.body.map(r => r.author)

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        assert(contents.includes('Seppo'))
    })

    test('Make likes 0 if added blog doesnt include any likes', async() => {
        const newBlog = {
            'title': 'Ei tykkäyksiä',
            'author': 'Seppo',
            'url': 'ei mikään'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

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
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    describe('Deletion of a blog', () => {
        test('Succeed with statuscode 204, if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = await blogsAtStart[0]
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const contents = blogsAtEnd.map(r => r.author)
            assert(!contents.includes(blogToDelete.author))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
        })

        test('Fails with statuscode 404 if id is invalid', async () => {
            const invalidId = '4562465247524'

            await api
                .delete(`/api/blogs/${invalidId}`)
                .expect(400)
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
                .send(updatedBlog)
                .expect(400)

        })
    })
})



after(async () => {
    await mongoose.connection.close()
})
