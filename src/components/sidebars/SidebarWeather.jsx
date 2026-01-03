import React, { useEffect, useState } from 'react';
import '../../styles/SidebarWeather.css';

/**
 * CONFIGURAÇÕES GLOBAIS
 */
const LATITUDE = -1.4558;     // Belém
const LONGITUDE = -48.5039;
const CACHE_KEY = 'weather-belem-cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

const SidebarWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState(null); // 🔎 DEBUG VISÍVEL

  useEffect(() => {
    loadWeather();
  }, []);

  /**
   * 🔥 FUNÇÃO PRINCIPAL
   */
  const loadWeather = async () => {
    setLoading(true);
    setDebug(null);

    try {
      console.group('🌦️ WEATHER DEBUG');

      /**
       * 🧠 1. CACHE
       */
      console.log('[1] Verificando cache...');
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const parsed = JSON.parse(cached);
        const cacheAge = Date.now() - parsed.timestamp;

        console.log('[1.1] Cache encontrado | Idade:', cacheAge);

        if (cacheAge < CACHE_TTL) {
          console.log('[1.2] Cache válido → USANDO CACHE');
          setWeather(parsed.data);
          setLoading(false);
          console.groupEnd();
          return;
        }

        console.log('[1.3] Cache expirado → ignorando');
      }

      /**
       * 🌐 2. URL CORRETA (SEM 400)
       */
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LATITUDE}` +
        `&longitude=${LONGITUDE}` +
        `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code` +
        `&timezone=auto`;

      console.log('[2] URL GERADA:', url);

      /**
       * 📡 3. FETCH
       */
      const response = await fetch(url);
      console.log('[3] STATUS HTTP:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      /**
       * 📦 4. JSON
       */
      const data = await response.json();
      console.log('[4] RESPOSTA DA API:', data);

      if (!data.hourly || !data.hourly.time) {
        throw new Error('Estrutura hourly inválida');
      }

      /**
       * ⏱️ 5. SINCRONIZA HORA
       */
      const nowISO = new Date().toISOString().slice(0, 13);
      console.log('[5] Hora atual ISO:', nowISO);

      let hourIndex = data.hourly.time.findIndex(t =>
        t.startsWith(nowISO)
      );

      if (hourIndex === -1) {
        console.warn('[5.1] Hora não encontrada → fallback para índice 0');
        hourIndex = 0;
      }

      console.log('[5.2] Índice final:', hourIndex);

      /**
       * 🧩 6. MONTA OBJETO FINAL
       */
      const weatherFinal = {
        temperature: data.hourly.temperature_2m[hourIndex],
        humidity: data.hourly.relative_humidity_2m[hourIndex],
        rain: data.hourly.precipitation_probability[hourIndex],
        weathercode: data.hourly.weather_code[hourIndex],
        hourly: data.hourly
      };

      console.log('[6] WEATHER FINAL:', weatherFinal);

      /**
       * 💾 7. SALVA CACHE
       */
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: weatherFinal
        })
      );

      console.log('[7] Cache salvo com sucesso');

      setWeather(weatherFinal);
      console.groupEnd();

    } catch (error) {
      console.error('🔴 ERRO FINAL:', error);
      setDebug(error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🌤️ ÍCONES
   */
  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if ([1, 2].includes(code)) return '⛅';
    if (code === 3) return '☁️';
    if ([51, 61, 63, 65].includes(code)) return '🌧️';
    if ([71, 73, 75].includes(code)) return '❄️';
    return '🌤️';
  };

  /**
   * ⏳ LOADING
   */
  if (loading) {
    return (
      <aside className="sidebar-weather skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-circle" />
        <div className="skeleton-bar" />
      </aside>
    );
  }

  /**
   * ❌ ERRO + DEBUG VISÍVEL
   */
  if (!weather) {
    return (
      <aside className="sidebar-weather error">
        <h3>Previsão do Tempo</h3>
        <p>Erro ao carregar o clima.</p>

        {debug && (
          <details>
            <summary>🔎 Debug técnico</summary>
            <pre>{debug}</pre>
          </details>
        )}
      </aside>
    );
  }

  /**
   * ✅ UI FINAL
   */
  return (
    <aside className="sidebar-weather-card">
      <header className="weather-header">
        <span className="city">Belém</span>
        <span className="menu">⋯</span>
      </header>

      <div className="weather-now">
        <span className="icon animate">
          {getWeatherIcon(weather.weathercode)}
        </span>
        <span className="temp">
          {Math.round(weather.temperature)}°C
        </span>
        <span className="humidity">
          💧 {weather.humidity}%
        </span>
      </div>

      {/* 🔄 SCROLL HORIZONTAL */}
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
