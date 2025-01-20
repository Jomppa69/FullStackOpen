import { useState, useEffect } from 'react'
import axios from 'axios'
import PersonFrom from './components/PersonForm'
import {Filter, FilteredPersons} from './components/Filter'


const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log("effect");
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response.data)
      })
      
  }, [])
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter}/>

      <h2>Add new</h2>
      
      <PersonFrom persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>

      <FilteredPersons persons={persons} filter={filter}/>
    </div>
  )

}

export default App