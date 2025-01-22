import { useState } from 'react'
import CountryService from './components/countryService'

function App() {
  const [countryName, setCountryName] = useState("")

  const handleCountryChange = (event) => {
    setCountryName(event.target.value)
    console.log(`countryname set ${countryName}`)
  }
 
  const getCountries = () => {

  }

  return (
     <div>
        <input value={countryName} onChange={handleCountryChange} />
      <CountryService countryName={countryName} setCountryName={setCountryName}/>
     </div>
  )
}

export default App
