const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        'title': 'Blogi',
        'author': 'Minä itse',
        'url': 'ei mikään',
        'likes': 10,
        'id': '67a22826eee5399f3b050441'
    },
    {
        'title': 'Blogi kaksi',
        'author': 'Minä itse',
        'url': 'ei mikään',
        'likes': 5,
        'id': '67a236f14fc4ad9dea31e22e'
    },
    {
        'title': 'Blogi kolme',
        'author': 'seppo',
        'url': 'ei mikään',
        'likes': 5,
        'id': '67a236f14fc4ad9dea31e22e'
    }
]

const singleBlog = [
    {
        'title': 'Blogi',
        'author': 'Minä itse',
        'url': 'ei mikään',
        'likes': 10,
        'id': '67a22826eee5399f3b050441'
    },
]

describe('list_helper', () => {

    describe('totalLikes', () => {

        test('TotalLikes returns sum of all likes', () => {
            const result = listHelper.totalLikes(blogs)
            assert.strictEqual(result, 20)
        })

        test('TotalLikes returns likes of a single blog, if list only has one blog', () => {
            const result = listHelper.totalLikes(singleBlog)
            assert.strictEqual(result, 10)
        })
    })

    describe('favouriteBlog', () => {

        test('favouriteBlog returns the blog with most likes', () => {
            const result = listHelper.favouriteBlog(blogs)
            assert.deepStrictEqual(result, {
                'title': 'Blogi',
                'author': 'Minä itse',
                'url': 'ei mikään',
                'likes': 10,
                'id': '67a22826eee5399f3b050441'
            })
        })
    })

    describe('mostBlogs', () => {

        test('mostBlogs returns the author of the most blogs', () => {
            const result = listHelper.mostBlogs(blogs)
            assert.deepStrictEqual(result, {
                'author': 'Minä itse',
                'blogs': 2
            })
        })

        test('mostBlogs works with list of 1 blog', () => {
            const result = listHelper.mostBlogs(singleBlog)
            assert.deepStrictEqual(result, {
                'author': 'Minä itse',
                'blogs': 1
            })
        })
    })

    describe('mostLikes', () => {

        test('mostLikes returns the author with the most likes', () => {
            const result = listHelper.mostLikes(blogs)
            assert.deepStrictEqual(result, {
                'author': 'Minä itse',
                'likes': 15
            })
        })

        test('mostLikes works with list of 1 blog', () => {
            const result = listHelper.mostLikes(singleBlog)
            assert.deepStrictEqual(result, {
                'author': 'Minä itse',
                'likes': 10
            })
        })
    })
})
