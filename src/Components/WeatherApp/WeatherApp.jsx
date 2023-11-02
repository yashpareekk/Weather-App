import React, { useState } from "react";
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

  const search = () => {
    const city = document.querySelector(".cityInput").value;
    if (city === "") return;
    const url = `https://api.openweathermap.org/data/2.5/weather?&q=${city}&units=Metric&appid=${Api}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setWeatherData({
          temp: Math.floor(data.main.temp),
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
        <input type="text" className="cityInput" placeholder="Search" />
        <div className="search-icon" onClick={search}>
          <img src={Search} alt="search" />
        </div>
      </div>
      <div className="weather-image">
        <img src={Wicon} alt="cloud" />
      </div>
      <div className="weather-temp">{weatherData.temp}'c</div>
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
