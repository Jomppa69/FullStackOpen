import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: ''
  })

  useEffect(() => {
    if(user && blogs.length == 0) {
      blogService
        .getAll()
        .then(initialBlogs => {
          setBlogs(initialBlogs)
        }).catch(error => {
          setNotification({
            message: "Failed to get blogs",
            type: "error"
          })
        })
    } else {
      setBlogs([])
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const likeBlog = (blog) => {
    const likedBlog = blog
    likedBlog.likes += 1
    console.log(`blog liked ${blog.likes}`);
    blogService
      .update(likedBlog.id, likedBlog)
      .then(updatedBlog => {
        setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
      })
  }

  const deleteBlog = (blog) => {
    if(!window.confirm(`Remove "${blog.title}"?`)) {
      return
    }
    blogService
    .remove(blog.id)
    .then(response => {
      setBlogs(blogs.filter(b => b.id !== blog.id))
    })
  }

  return (
    <div>
      <Notification notification={notification} setNotification={setNotification}/>
      <LoginForm user={user} setUser={setUser} setNotification={setNotification} />
      {user && (
        <div>
          <h1>Blogs</h1>
          <BlogList blogs={blogs} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
          <Togglable showLabel='New blog'>
            <CreateBlog 
              blogs={blogs} 
              setBlogs={setBlogs} 
              setNotification={setNotification}
              />
          </Togglable>
        </div>)}

    </div>
  )
}

export default App