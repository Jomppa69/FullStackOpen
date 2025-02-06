const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// Get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

// Add blog
blogsRouter.post('/', async (request, response) => {
    if(!request.body.likes) {
        request.body.likes = 0
    }
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// Modify existing blog
blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
})

module.exports = blogsRouter