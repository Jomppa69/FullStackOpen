const Blog = require('../models/blog')

const initialBlogs = [
    {
        'title': 'Blogi',
        'author': 'Janne',
        'url': 'ei mikään',
        'likes': 10,
    },
    {
        'title': 'Blogi kaksi',
        'author': 'Minä itse',
        'url': 'ei mikään',
        'likes': 5,
    },
    {
        'title': 'Blogi kolme',
        'author': 'seppo',
        'url': 'ei mikään',
        'likes': 5,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}