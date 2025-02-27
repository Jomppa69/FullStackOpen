import { useState } from 'react'
import loginService from '../services/login'
import personService from '../services/personService'



const LoginForm = ({setUser, setNotification}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
          const user= await loginService.login({
            username, password
          })

          window.localStorage.setItem(
            'loggedPersonappUser', JSON.stringify(user)
          )
          personService.setToken(user.token)
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


    return (
        <>
            <h2>Login</h2><form onSubmit={handleLogin}>
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
                    <input type="text"
                        value={password}
                        name='Password'
                        onChange={({ target }) => setPassword(target.value)} />
                </div>
                <button type='submit'>login</button>
            </form>
        </>
    )
}

export default LoginForm