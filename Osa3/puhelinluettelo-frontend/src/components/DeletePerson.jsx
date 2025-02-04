import { useState } from 'react'
import personService from '../services/personService'

const DeletePerson = ({persons, setPersons, setNotification}) => {
    const [personName, setPersonName] = useState('')

    const handleNameChange = (event) => {
        setPersonName(event.target.value)
    }

    const removePersonRequest = (event) => {
        event.preventDefault()
        const personToRemove = persons.find(p => p.name.toLowerCase() === personName.toLowerCase())

        if (!personToRemove) {
            setNotification({
                message: `No such person as: '${personName}'`,
                 type: "error"
                })
        
        } else if (window.confirm(`Delete '${personToRemove.name}', number: '${personToRemove.number}'?`)) {
            personService
            .remove(personToRemove.id)
            .then(() => {
                setPersons(persons.filter(person => person.name !== personToRemove.name))
                setNotification({
                    message: `Person has been deleted!`,
                     type: "info"
                    })
            })
        }
        setPersonName("")
    }

    return (
        <form onSubmit={removePersonRequest}>
            <div>
                name <input value = {personName} onChange={handleNameChange}/>
            </div>
            <div>
                <button type='submit'>delete person</button>
            </div>
        </form>
    )
}

export default DeletePerson