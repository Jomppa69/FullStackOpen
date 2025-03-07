const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

// Add blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    if(!body.likes) {
        body.likes = 0
    }
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    const user = request.user
    if (user.blogs.includes(id)) {
        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } else {
        response.status(403).json({ error: 'forbidden: blog not found' })
    }

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