import { useState } from 'react'

const PersonForm = ({persons, setPersons}) => {
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
    
        if(persons.some(person => person.name === newName))  {
          alert(`${newName} is already added to phonebook`)
    
        } else {
          const personObject = {
            name: newName,
            number: newNumber
          }
    
          setPersons(persons.concat(personObject))
          setNewName("")
          setNewNumber("")
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