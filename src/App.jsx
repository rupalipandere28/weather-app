import React, { useState, useEffect } from 'react';

const API_KEY = '897c21e73e5becfba7607b2601ec5f6b';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        setWeatherData(null);
        alert(data.message);
      }
    } catch (error) {
      alert('Error fetching weather data');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <div className='container mt-5'>
      <div className='card mx-auto p-4 shadow ' style={{ maxWidth: '800px' }}>
        <h2 className='text-center mb-4'>🌤 Weather App</h2>

        <form onSubmit={handleSearch} className='mb-3 d-flex gap-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Enter city name'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className='btn btn-primary' type='submit'>
            Search
          </button>
        </form>

        {loading ? (
          <div className='text-center'>Loading...</div>
        ) : weatherData ? (
          <div className='text-center'>
            <h4>
              {weatherData.name}, {weatherData.sys.country}
            </h4>
            <h2>{weatherData.main.temp}°C</h2>
            <p className='lead'>
              {weatherData.weather[0].main} - {weatherData.weather[0].description}
            </p>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt='weather-icon' />
          </div>
        ) : (
          <div className='text-center text-muted'>Enter a city to see weather</div>
        )}
      </div>
    </div>
  );
};

export default App;
