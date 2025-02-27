import Person from './Person'

const Filter = ({filter, setFilter}) => {
    

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    return <>filter shown with: <input value={filter} onChange={handleFilterChange}/></>
}

const FilteredPersons = ({persons, filter}) => {
    const personsToShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    return (
    <>
        <h2>Numbers</h2>
        <ul>
            {personsToShow.map(person => <Person key={person.name} person={person} />)}
        </ul>
    </>
    )
}

export { Filter, FilteredPersons }



 

 