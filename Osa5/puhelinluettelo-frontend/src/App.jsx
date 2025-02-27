import { useState, useEffect } from 'react'
import personService from './services/personService'
import PersonFrom from './components/PersonForm'
import {Filter, FilteredPersons} from './components/Filter'
import DeletePerson from './components/DeletePerson'
import Notification from './Notification'
import LoginForm from './components/loginFrom'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: ""
  })

  const [user, setUser] = useState(null)

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

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} setNotification={setNotificationMessage}/>
      <Filter filter={filter} setFilter={setFilter}/>

      
    {!user && LoginForm({setUser, setNotificationMessage})}
    {user && <div>
      <p>{user.name} logged in</p>
      {PersonFrom({persons, setPersons, setNotificationMessage})}
      </div>
    }
      
      
      

     
      <DeletePerson persons={persons} setPersons={setPersons} setNotification={setNotificationMessage}/>
     

      <FilteredPersons persons={persons} filter={filter}/>
    </div>
  )

}

export default App