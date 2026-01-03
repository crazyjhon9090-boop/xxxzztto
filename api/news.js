export default async function handler(req, res) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key não configurada" });
  }

  const url = `https://gnews.io/api/v4/top-headlines?lang=pt&country=br&max=5&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar notícias" });
  }
}
