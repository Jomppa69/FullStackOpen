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
            console.log(error)
        
        } else if (window.confirm(`Delte '${personToRemove.name}', number: '${personToRemove.number}'?`)) {
            personService
            .remove(personToRemove.id)
            .then(returnedPerson => {
                setPersons(persons.filter(person => person.name !== returnedPerson.name))
                setNotification({
                    message: `Person: '${returnedPerson.name}' has been deleted!`,
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