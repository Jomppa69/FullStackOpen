import axios, { all } from 'axios'
import { useState, useEffect } from 'react'
import WeatherService from './weatherService'

const CountryService = ({countryName, setCountryName}) => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
    const [allCountries, setAllCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])

    useEffect(() => {
        const request = axios.get(baseUrl)
        request.then(response => {
            setAllCountries(response.data)
        })
    }, [])

    useEffect(() => {
        console.log(` this is the country name: ${countryName}`);
        
        setFilteredCountries(
            countryName === "" ?
            [] : 
            allCountries
                .filter(country => country.name.common.toLowerCase()
                .includes(countryName.toLowerCase()))
    )}, [countryName])

    if (filteredCountries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
        return (
            <ul>
                {filteredCountries.map(country => (
                    <li key={country.name.common}>{country.name.common}
                    <button onClick={() => setCountryName(country.name.common)}>show</button></li>
                ))}
            </ul>
        )
    } else if (filteredCountries.length === 1) {
        return (
            <div>
                <h1>{filteredCountries[0].name.common}</h1>
                {filteredCountries[0].capital}
                <br />
                area: {filteredCountries[0].area}
                <h2>languages:</h2>
                <ul>
                    {Object.values(filteredCountries[0].languages).map((language, index) => (
                        <li key={index}>{language}</li>
                    ))}
                </ul>
                <img src={filteredCountries[0].flags.png} alt={filteredCountries[0].flag} />
                <WeatherService cityName={filteredCountries[0].name.common} coordinates={filteredCountries[0].capitalInfo.latlng}/>
            </div>
        )
    } else {
        return null;
    }
}

export default CountryService