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
        'author': 'Minä itse',
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
            console.log('Result: ', result)
            assert.deepStrictEqual(result, {
                'title': 'Blogi',
                'author': 'Minä itse',
                'url': 'ei mikään',
                'likes': 10,
                'id': '67a22826eee5399f3b050441'
            })
        })
    })
})
