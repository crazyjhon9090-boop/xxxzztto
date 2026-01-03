import { useEffect, useState } from 'react';
import '../styles/newsbar.css';

const NewsBar = () => {
  const [news, setNews] = useState([]);
  const [usd, setUsd] = useState(null);

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  useEffect(() => {
    loadNews();
    loadDollar();
  }, []);

  const loadNews = async () => {
    if (!API_KEY) return;

    const cached = localStorage.getItem('news_cache');
    const cacheTime = localStorage.getItem('news_cache_time');

    if (cached && cacheTime && Date.now() - cacheTime < 15 * 60 * 1000) {
      setNews(JSON.parse(cached));
      return;
    }

    try {
      const res = await fetch(
        `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=5&apikey=${API_KEY}`
      );

      const data = await res.json();
      setNews(data.articles || []);

      localStorage.setItem('news_cache', JSON.stringify(data.articles));
      localStorage.setItem('news_cache_time', Date.now());
    } catch (err) {
      console.error(err);
    }
  };

  const loadDollar = async () => {
    try {
      const res = await fetch(
        'https://economia.awesomeapi.com.br/json/last/USD-BRL'
      );
      const data = await res.json();
      setUsd(data.USDBRL);
    } catch {}
  };

  // limita a quantidade visível
  const visibleNews = news.slice(0, 4);

  // duplica só essas para o scroll ficar suave
  const scrollingNews = [...visibleNews, ...visibleNews];


  return (
    <div className="news-bar">

      <div className="news-scroll-wrapper">
        <div className="news-scroll">
          {scrollingNews.length ? (
            scrollingNews.map((n, i) => (
              <a
                key={i}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-item"
              >
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                )}

                <span>{n.title}</span>
              </a>
            ))
          ) : (
            <span>Carregando notícias…</span>
          )}
        </div>
      </div>

      {usd && (
        <div className="usd">
          💵 USD {Number(usd.bid).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default NewsBar;
