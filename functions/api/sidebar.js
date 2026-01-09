const admin = require('firebase-admin');
const { initAdmin } = require('../_firebase');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

initAdmin();
const db = admin.firestore();

const LAT = -1.4558;
const LNG = -48.5039;

module.exports = async function sidebar(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=300'
  );

  try {
    /* ================= NEWS ================= */
    const newsRes = await fetch(
      `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=5&apikey=${process.env.GNEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    const news = (newsData.articles || []).map(n => ({
      title: n.title,
      url: n.url,
      image: n.image
    }));

    /* ================= WEATHER ================= */
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=auto`
    );
    const weatherRaw = await weatherRes.json();

    const nowISO = new Date().toISOString().slice(0, 13);
    let hourIndex =
      weatherRaw.hourly.time.findIndex(t => t.startsWith(nowISO));
    if (hourIndex < 0) hourIndex = 0;

    const weather = {
      temperature: weatherRaw.hourly.temperature_2m[hourIndex],
      humidity: weatherRaw.hourly.relative_humidity_2m[hourIndex],
      rain: weatherRaw.hourly.precipitation_probability[hourIndex],
      code: weatherRaw.hourly.weather_code[hourIndex],
      hourly: weatherRaw.hourly.time.slice(0, 8).map((t, i) => ({
        time: t,
        temp: weatherRaw.hourly.temperature_2m[i],
        rain: weatherRaw.hourly.precipitation_probability[i],
        code: weatherRaw.hourly.weather_code[i]
      }))
    };

    /* ================= VIDEOS ================= */
    const videosSnap = await db
      .collection('videos')
      .orderBy('createdAt', 'desc')
      .limit(4)
      .get();

    const videos = videosSnap.docs.map(doc => {
      const v = doc.data();
      return {
        id: doc.id,
        title: v.title,
        subtitle: v.subtitle || '',
        youtubeId: v.youtubeId
      };
    });

    /* ================= CATEGORIES ================= */
    const catsSnap = await db.collection('categories').get();
    const categories = catsSnap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title
    }));

    res.status(200).json({
      news,
      weather,
      videos,
      categories
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao carregar sidebar' });
  }
};
