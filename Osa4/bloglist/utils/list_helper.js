const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    const totalLikes = blogs.reduce((sum, item) => item.likes + sum, 0)

    return totalLikes
}

const favouriteBlog = (blogs) => {
    const favourite = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    return favourite
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}