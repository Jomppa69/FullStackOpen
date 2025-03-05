import Togglable from './Togglable'

const Blog = ({ blog, likeBlog, deleteBlog }) => (
  <div>
    <li>
      {blog.title} {blog.author}
      <Togglable showLabel="show" hideLabel="hide">
        <p>URL: {blog.url}</p>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <p>Likes: {blog.likes}</p>
          <button onClick={() => likeBlog(blog)}>Like</button>
        </div>
        <p>User: {blog.user.username}</p>
        <button onClick={() => deleteBlog(blog)}>Delete</button>
      </Togglable>
      </li>
  </div>  
)

export default Blog