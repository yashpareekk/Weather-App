import React, { useRef, useState } from "react";
import axios from "axios";
import "./WeatherApp.css";
import Search from "../assets/search.png";
import Rain from "../assets/rain.png";
import Humidity from "../assets/humidity.png";
import Snow from "../assets/snow.png";
import Wind from "../assets/wind.png";
import Clear from "../assets/clear.png";
import Cloud from "../assets/cloud.png";
import Dizzle from "../assets/drizzle.png";

const WeatherApp = () => {
  const Api = "c5b1934d0e987eff89cc425c6ff170b1";
  const [Wicon, setWicon] = useState(Cloud);
  const [weatherData, setWeatherData] = useState({
    temp: "25",
    humidity: "55",
    wind: "20",
    location: "Jaipur",
  });

  let cites = useRef()
  const search = () => {
    const city =cites.current.value;
    
    if (city === "") return;
    const url = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&units=Metric&appid=${Api}`;
    axios
      .get(url)
      .then((response) => {
        const data = response?.data;
        setWeatherData({
          temp: Math.floor(data?.main?.temp),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          location: data.name,
        });
        setWicon(getIcon(data.weather[0].icon));
      })
      .catch((error) => {
        console.error("Error fetching weather data", error);
      });
  };

  const getIcon = (icon) => {
    return icon === "01d" || icon === "01n"
      ? Clear
      : icon.startsWith("02")
      ? Cloud
      : icon.startsWith("03") || icon.startsWith("04")
      ? Dizzle
      : icon.startsWith("09") || icon.startsWith("10")
      ? Rain
      : icon.startsWith("13")
      ? Snow
      : Clear;
  };

  return (
    <div className="container">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="Search" ref={cites}/>
        <div className="search-icon" onClick={search}>
          <img src={Search} alt="search" />
        </div>
      </div>
      <div className="weather-image">
        <img src={Wicon} alt="cloud" />
      </div>
      <div className="weather-temp">{weatherData.temp}&#x2103; </div>
      <div className="weather-location">{weatherData.location}</div>
      <div className="data-container">
        <div className="element">
          <img src={Humidity} alt="humidity" className="icon" />
          <div className="data">
            <div className="humidity-percent">{weatherData.humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={Wind} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-speed">{weatherData.wind} Km/h</div>
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;


/*
class based Level code 

import React, { useReducer, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./WeatherApp.css";
import { Search, Rain, Humidity, Snow, Wind, Clear, Cloud, Dizzle } from "../assets";

const initialState = {
  city: localStorage.getItem('city') || "Jaipur",
  weatherData: { temp: "25", humidity: "55", wind: "20", location: localStorage.getItem('city') || "Jaipur" },
  Wicon: Cloud,
  loading: false,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
    case 'SET_ICON':
      return { ...state, Wicon: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const WeatherApp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const cites = useRef();

  const getIcon = useCallback((icon) => ({ '01': Clear, '02': Cloud, '03': Dizzle, '04': Dizzle, '09': Rain, '10': Rain, '13': Snow }[icon.slice(0, 2)] || Clear), []);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    axios.get(`https://api.openweathermap.org/data/2.5/weather?&q=${state.city}&units=Metric&appid=c5b1934d0e987eff89cc425c6ff170b1`)
      .then(({ data }) => {
        dispatch({ type: 'SET_WEATHER_DATA', payload: { temp: Math.floor(data.main.temp), humidity: data.main.humidity, wind: data.wind.speed, location: data.name } });
        dispatch({ type: 'SET_ICON', payload: getIcon(data.weather[0].icon) });
      })
      .catch((error) => dispatch({ type: 'SET_ERROR', payload: error.message }))
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }));
  }, [state.city]);

  useEffect(() => {
    localStorage.setItem('city', state.city);
  }, [state.city]);

  return (
    <div className="container">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="Search" ref={cites}/>
        <div className="search-icon" onClick={() => dispatch({ type: 'SET_CITY', payload: cites.current.value })}><img src={Search} alt="search" /></div>
      </div>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div>Error: {state.error}</div>
      ) : (
        <>
          <div className="weather-image"><img src={state.Wicon} alt="cloud" /></div>
          <div className="weather-temp">{state.weatherData.temp}℃ </div>
          <div className="weather-location">{state.weatherData.location}</div>
          <div className="data-container">
            {[{ icon: Humidity, value: state.weatherData.humidity + '%', text: 'Humidity' }, { icon: Wind, value: state.weatherData.wind + ' Km/h', text: 'Wind speed' }].map(({ icon, value, text }) => (
              <div className="element" key={text}>
                <img src={icon} alt={text.toLowerCase()} className="icon" />
                <div className="data">
                  <div className="humidity-percent">{value}</div>
                  <div className="text">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;

_________________________________________________________________________________________________________________________________________________


Level hardest

import React, { useReducer, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import axios from "axios";
import "./WeatherApp.css";
import { Search, Rain, Humidity, Snow, Wind, Clear, Cloud, Dizzle } from "../assets";

const initialState = {
  city: localStorage.getItem('city') || "Jaipur",
  weatherData: { temp: "25", humidity: "55", wind: "20", location: localStorage.getItem('city') || "Jaipur" },
  Wicon: Cloud,
  loading: false,
  error: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_WEATHER_DATA':
      return { ...state, weatherData: action.payload };
    case 'SET_ICON':
      return { ...state, Wicon: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const WeatherContext = createContext();

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    axios.get(url)
      .then(({ data }) => setData(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};

const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const cites = useRef();

  const getIcon = useCallback((icon) => ({ '01': Clear, '02': Cloud, '03': Dizzle, '04': Dizzle, '09': Rain, '10': Rain, '13': Snow }[icon.slice(0, 2)] || Clear), []);
  
  const url = useMemo(() => `https://api.openweathermap.org/data/2.5/weather?&q=${state.city}&units=Metric&appid=c5b1934d0e987eff89cc425c6ff170b1`, [state.city]);
  
  const { data } = useFetch(url);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_WEATHER_DATA', payload: { temp: Math.floor(data.main.temp), humidity: data.main.humidity, wind: data.wind.speed, location: data.name } });
      dispatch({ type: 'SET_ICON', payload: getIcon(data.weather[0].icon) });
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('city', state.city);
  }, [state.city]);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

const WeatherApp = () => {
  const cites = useRef();
  const { state } = useContext(WeatherContext);

  return (
    <div className="container">
      <div className="top-bar">
        <input type="text" className="cityInput" placeholder="Search" ref={cites}/>
        <div className="search-icon" onClick={() => dispatch({ type: 'SET_CITY', payload: cites.current.value })}><img src={Search} alt="search" /></div>
      </div>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div>Error: {state.error}</div>
      ) : (
        <>
          <div className="weather-image"><img src={state.Wicon} alt="cloud" /></div>
          <div className="weather-temp">{state.weatherData.temp}℃ </div>
          <div className="weather-location">{state.weatherData.location}</div>
          <div className="data-container">
            {[{ icon: Humidity, value: state.weatherData.humidity + '%', text: 'Humidity' }, { icon: Wind, value: state.weatherData.wind + ' Km/h', text: 'Wind speed' }].map(({ icon, value, text }) => (
              <div className="element" key={text}>
                <img src={icon} alt={text.toLowerCase()} className="icon" />
                <div className="data">
                  <div className="humidity-percent">{value}</div>
                  <div className="text">{text}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default () => (
  <WeatherProvider>
    <WeatherApp />
  </WeatherProvider>
);

 */