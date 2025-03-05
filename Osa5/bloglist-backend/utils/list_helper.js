const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const totalLikes = blogs.reduce((sum, item) => item.likes + sum, 0)

    return totalLikes
}

const favouriteBlog = (blogs) => {
    const favouriteBlog = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return favouriteBlog
}

const mostBlogs = (blogs) => {
    const authorBlogCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})

    const mostBlogsAuthor = Object.keys(authorBlogCounts).reduce((a, b) => {
        return authorBlogCounts[a] > authorBlogCounts[b] ? a : b
    })

    return {
        author: mostBlogsAuthor,
        blogs: authorBlogCounts[mostBlogsAuthor]
    }
}

const mostLikes = (blogs) => {
    const authorLikeCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})


    const mostLikesAuthor = Object.keys(authorLikeCounts).reduce((a, b) => {
        return authorLikeCounts[a] > authorLikeCounts[b] ? a : b
    })

    return {
        author: mostLikesAuthor,
        likes: authorLikeCounts[mostLikesAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}