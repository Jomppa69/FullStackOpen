import { useState } from 'react'
import personService from '../services/personService'


const PersonForm = ({persons, setPersons, setNotification}) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
      }
    
      const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
      }
    
      const addPerson = (event) => {
        event.preventDefault()
        const personObject = {
          name: newName,
          number: newNumber
        }
    
        if(persons.some(person => person.name.toLowerCase() === newName.toLowerCase()))  {
          if (window.confirm(`'${newName}' is already added to phonebook, replace the old number with a new one`)) {
            const personToUpdate = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
            personService
              .update(personToUpdate.id, personObject)
              .then(returnedPerson => {
                setPersons(persons.map(person => person.id !== returnedPerson.id ? person: returnedPerson))
                setNotification({
                  message: `Person: '${returnedPerson.name}' updated succesfully!`,
                   type: "info"
                  })
              })

          }
        } else {
          personService
            .create(personObject)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNotification({
                message: `Person: '${returnedPerson.name}' created succesfully!`,
                 type: "info"
                })
              setNewName("")
              setNewNumber("")
            })
          
        }
      }

    return (
        <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm