import { useState, useEffect } from 'react'
import personService from './services/personService'
import PersonFrom from './components/PersonForm'
import {Filter, FilteredPersons} from './components/Filter'
import DeletePerson from './components/DeletePerson'
import Notification from './Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: ""
  })

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
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationMessage={notificationMessage} setNotification={setNotificationMessage}/>
      <Filter filter={filter} setFilter={setFilter}/>

      <h2>Add new</h2>
      
      <PersonFrom persons={persons} setPersons={setPersons} setNotification={setNotificationMessage}/>

      <h2>Delete person</h2>
      <DeletePerson persons={persons} setPersons={setPersons} setNotification={setNotificationMessage}/>
      <h2>Numbers</h2>

      <FilteredPersons persons={persons} filter={filter}/>
    </div>
  )

}

export default App