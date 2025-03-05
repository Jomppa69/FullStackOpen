import { useState, useEffect, useRef } from 'react'
import personService from './services/personService'
import PersonFrom from './components/PersonForm'
import {Filter, FilteredPersons} from './components/Filter'
import DeletePerson from './components/DeletePerson'
import Notification from './Notification'
import LoginForm from './components/loginFrom'
import loginService from './services/login'
import Togglable from './components/Togglable'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: ""
  })
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  const personFormRef = useRef()

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        setNotificationMessage({
          message: "Failed to getAll on startup",
          type: "error"
        })
        console.log(error)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPersonappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      personService.setToken(user.token)
    }
  }, [])

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
      setNotificationMessage({
        message: 'wrong credentials',
        type: 'error'
      })
    }
  }

  const loginForm = () => {
    const hideWhenVisible = {display: loginVisible ? 'none' : ''}
    const showWhenVisible = {display: loginVisible ? '' : 'none'}

    return (
      <div>
        <div style={hideWhenVisible}>
            <button onClick={() => setLoginVisible(true)}> log in </button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} setNotification={setNotificationMessage}/>
      <Filter filter={filter} setFilter={setFilter}/>

    {!user && loginForm()}
    {user && <div>
      <p>{user.name} logged in</p>
      <Togglable buttonLabel="new person" ref={personFormRef}>
        <PersonFrom 
          persons={persons}
          setPersons={setPersons}
          setNotification={setNotificationMessage}
        />
      </Togglable>
      </div>
    }
      <DeletePerson persons={persons} setPersons={setPersons} setNotification={setNotificationMessage}/>
      <FilteredPersons persons={persons} filter={filter}/>
    </div>
  )

}

export default App