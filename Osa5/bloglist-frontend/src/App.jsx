import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'

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

  return (
    <div>
      <Notification notification={notification} setNotification={setNotification}/>
      <LoginForm user={user} setUser={setUser} setNotification={setNotification} />
      {user && (
        <div>
          <h1>Blogs</h1>
          <BlogList blogs={blogs} />
          <CreateBlog blogs={blogs} setBlogs={setBlogs} setNotification={setNotification}/>
        </div>)}

    </div>
  )
}

export default App