import { useState } from "react"
import loginService from '../services/login'
import blogService from '../services/blogs'


const LoginForm = ({ user, setUser, setNotification }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({username, password})
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setNotification({
                message: 'wrong credentials',
                type: 'error'
            })
        } 

    }

    const handleLogOut = async (event) => {
        console.log(`logout ${user.name}`);
        setUser(null);
        window.localStorage.clear()
    }

    if (!user) {
        return (
            <>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div>
                        username
                        <input
                            type="text"
                            value={username}
                            name='Username'
                            onChange={({ target }) => setUsername(target.value)} />
                    </div>
                    <div>
                        password
                        <input 
                            type="password"
                            value={password}
                            name='Password'
                            onChange={({ target }) => setPassword(target.value)} />
                    </div>
                    <button type='submit'>login</button>
                </form>
            </>
        )
    }

    return (
        <div>
            <p>{user.name} logged in</p>
            <button onClick={handleLogOut}>Log out</button>
        </div>
    )
    
}

export default LoginForm
