import React, { useEffect, useState } from 'react';
import '../../styles/SidebarWeather.css';

const LATITUDE = -1.4558;
const LONGITUDE = -48.5039;
const CACHE_KEY = 'weather-belem-cache-v2'; // 🔥 nova versão
const CACHE_TTL = 10 * 60 * 1000;

const DEBUG = true; // 👈 mude para false depois

const SidebarWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    setDebug(null);

    try {
      /* ================= CACHE ================= */
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;

        if (age < CACHE_TTL) {
          setWeather(parsed.data);
          setLoading(false);
          return;
        }
      }

      /* ================= FETCH ================= */
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LATITUDE}` +
        `&longitude=${LONGITUDE}` +
        `&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code` +
        `&daily=sunset` +
        `&timezone=auto`;

      const res = await fetch(url);
      const data = await res.json();

      if (DEBUG) console.log('🌦️ API DATA:', data);

      if (!data.hourly || !data.hourly.time) {
        throw new Error('Estrutura hourly inválida');
      }

      /* ================= HORA ATUAL ================= */
      const nowISO = new Date().toISOString().slice(0, 13);
      let hourIndex = data.hourly.time.findIndex(t =>
        t.startsWith(nowISO)
      );
      if (hourIndex === -1) hourIndex = 0;

      /* ================= SUNSET SAFE ================= */
      const sunsetISO =
        data.daily?.sunset?.[0] ?? null;

      const sunsetFormatted = sunsetISO
        ? new Date(sunsetISO).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        : '—';

      /* ================= FINAL OBJ ================= */
      const weatherFinal = {
        temperature: data.hourly.temperature_2m[hourIndex],
        feelsLike: data.hourly.apparent_temperature?.[hourIndex],
        humidity: data.hourly.relative_humidity_2m[hourIndex],
        rain: data.hourly.precipitation_probability[hourIndex],
        weathercode: data.hourly.weather_code[hourIndex],
        condition: getWeatherText(data.hourly.weather_code[hourIndex]),
        sunset: sunsetFormatted,
        hourly: data.hourly
      };

      if (DEBUG) console.log('✅ WEATHER FINAL:', weatherFinal);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: weatherFinal
        })
      );

      setWeather(weatherFinal);

    } catch (err) {
      console.error('❌ Weather error:', err);
      setDebug(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if ([1, 2].includes(code)) return '⛅';
    if (code === 3) return '☁️';
    if ([51, 61, 63, 65].includes(code)) return '🌧️';
    return '🌤️';
  };

  const getWeatherText = (code) => {
    if (code === 0) return 'Céu limpo';
    if ([1, 2].includes(code)) return 'Parcialmente nublado';
    if (code === 3) return 'Nublado';
    if ([51, 61, 63, 65].includes(code)) return 'Chuva';
    return 'Clima variável';
  };

  /* ================= STATES ================= */

  if (loading) {
    return <aside className="sidebar-weather skeleton" />;
  }

  if (!weather) {
    return (
      <aside className="sidebar-weather error">
        <p>Erro ao carregar clima</p>
        {DEBUG && debug && <pre>{debug}</pre>}
      </aside>
    );
  }

  /* ================= UI ================= */

  return (
    <aside className="sidebar-weather-card">
      <header className="weather-header">
        <span className="city">Belém</span>
        <span className="menu">⋯</span>
      </header>

      <div className="weather-now">
        <span className="icon">{getWeatherIcon(weather.weathercode)}</span>
        <span className="temp">{Math.round(weather.temperature)}°C</span>
        <span className="humidity">💧 {weather.humidity}%</span>
      </div>

      <div className="weather-extra">
        <span>🌡️ Sensação: {weather.feelsLike ?? '—'}°C</span>
        <span>☔ Chuva: {weather.rain}%</span>
        <span>📋 {weather.condition}</span>
        <span>🌇 Pôr do sol: {weather.sunset}</span>
      </div>

      <div className="weather-hourly">
        {weather.hourly.time.slice(0, 8).map((time, i) => (
          <div className="hour" key={time}>
            <span className="hour-time">
              {new Date(time).getHours()}h
            </span>
            <span className="hour-icon">
              {getWeatherIcon(weather.hourly.weather_code[i])}
            </span>
            <span className="hour-temp">
              {Math.round(weather.hourly.temperature_2m[i])}°
            </span>
            <span className="hour-rain">
              {weather.hourly.precipitation_probability[i]}%
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarWeather;
