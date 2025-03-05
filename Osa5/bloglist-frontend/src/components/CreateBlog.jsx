import { useState } from "react"
import blogService from "../services/blogs"

const CreateBlog = ({ blogs, setBlogs, setNotification }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newURL, setNewURL] = useState('')


    const handleTitleChange = (event) => {
        setNewTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setNewAuthor(event.target.value)
    }

    const handleURLChange = (event) => {
        setNewURL(event.target.value)
    }

    const updateBlog = (newBlog) => {
        if(!window.confirm(`'${newBlog.title}' already exists, update old blog with new values?`)) {
            return
        }

        const blogToUpdate = blogs.find(blog => blog.title.toLowerCase() === newBlog.title.toLowerCase())

        blogService
            .update(blogToUpdate.id, newBlog)
            .then(returnedBlog => {
                setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
                setNotification({
                    message: `Blog: '${returnedBlog.title}' updated succesfully!`,
                    type: 'info'
                })
            })
            .catch(error => {
                console.log(`Error response data: ${error.response.data}`)
                setNotification({
                    message: `Blog validation failed: ${error.response.data.error}`,
                    type: "error"
                })
            })
    }

    const addBlog = (newBlog) => {
        blogService
            .create(newBlog)
            .then(returnedBlog => {
                setBlogs(blogs.concat(returnedBlog))
                setNotification({
                    message: `Blog: '${returnedBlog.title}' created succesfully!`,
                    type: 'info'
                })
            })
            .catch(error => {
                console.log(`Error response data: ${error.response.data}`)
                setNotification({
                    message: `Blog validation failed: ${error.response.data.error}`,
                    type: "error"
                })
            })
    }

    const handleBlogSubmit = (event) => {
        event.preventDefault()
        const newBlog = {
            title: newTitle,
            author: newAuthor,
            url: newURL
        }

        if(blogs.some(blog => blog.title.toLowerCase() === newTitle.toLowerCase())) {
            updateBlog(newBlog)
        } else {
            addBlog(newBlog)
        }
    } 

    return (
        <div>
            <h1>Create new</h1>
            <form onSubmit={handleBlogSubmit}>
                <div>
                    Title: <input value={newTitle} onChange={handleTitleChange}/>
                </div>
                <div>
                    Author: <input value={newAuthor} onChange={handleAuthorChange}/>
                </div>
                <div>
                    URL: <input value={newURL} onChange={handleURLChange}/>
                </div>
                <div>
                    <button type="submit">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateBlog