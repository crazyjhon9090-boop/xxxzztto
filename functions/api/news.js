const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function news(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key não configurada' });
  }

  const url = `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=5&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=300'
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
};
