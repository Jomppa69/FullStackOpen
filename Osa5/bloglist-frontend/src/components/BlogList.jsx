import Blog from "./Blog"

const BlogList = ({ blogs, likeBlog, deleteBlog }) => {
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

    return (
        <ul>
            {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog}/>)}
        </ul>
    )
}

export default BlogList