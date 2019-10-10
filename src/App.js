import React, { useState, useEffect } from 'react';

import useDebouncedValue from './useDebouncedValue'
import { createQuery } from './util'
import './App.css';
// import logo from './logo.svg';

function App() {
	const [city, setCity] = useState('Belarus, Minsk')
	const [actualCity, setActualCity] = useState(null)
	const [weather, setWeather] = useState('good?')
	const [iconset, setIcon] = useState({alt: `it's unknown to human beings`})

	const queriableCity = useDebouncedValue(city, 400)

	useEffect(() => {
		const url = '//localhost:3001/weather'
		const querySet = {
			query: queriableCity,
			units: 'm',
		}
		const query = createQuery(querySet)
		const grabData = () => fetch(`${url}?${query}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		}).then(a => a.json())
		grabData()
			.then(data => {
				if (data.success === false)
					return false;

				setWeather(`${data.current.feelslike}°`)
				setIcon({ src: data.current.weather_icons[0] || '404.png', alt:data.current.weather_descriptions[0] || 'uh-oh..' })
				setActualCity(`${data.location.country}, ${data.location.name}`)
			})
			.catch(console.warn)

	}, [queriableCity])

  return (
    <div className="App">
			<h1>Weather with you.</h1>
			<h3>The city be <input
					className="editable"
					onChange={e => setCity(e.target.value)}
					defaultValue={city}
				/>
			</h3>
			{ actualCity && <p>Commonly known as { actualCity }</p>}
			<p>Right now it's kinda { weather }</p>
			<p><img className="icon" src={iconset.src} alt={iconset.alt}/></p>
    </div>
  );
}

export default App;
