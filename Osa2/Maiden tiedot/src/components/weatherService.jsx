import { useState, useEffect } from 'react'
import axios from 'axios'

const WeatherService = ({cityName, coordinates}) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const [weather, setWeather] = useState(null)
    console.log(apiKey)
    console.log(typeof apiKey)
    useEffect(() => {
        axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${coordinates[0]}, ${coordinates[1]}&aqi=no`)
        .then(response => {
            console.log(response.data)
            console.log("weather call made")
            setWeather(response.data)
        })
    }, [cityName])
    
    if(!weather) return null

    return (
        <div>
            <h1>Weather in {cityName}</h1>
            Temperature {weather.current.temp_c}°C
            <br />
            <img src={weather.current.condition.icon} alt="" />
            <br />
            Wind {weather.current.wind_kph}kph
            
        </div>
    )
}

export default WeatherService

