const admin = require('firebase-admin');
const { initAdmin } = require('../_firebase');

initAdmin();
const db = admin.firestore();

module.exports = async function videos(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=120'
  );

  try {
    const snap = await db
      .collection('videos')
      .orderBy('createdAt', 'desc')
      .limit(4)
      .get();

    const videos = snap.docs
      .map(doc => {
        const v = doc.data();

        // ignora vídeos sem youtubeId (segurança)
        if (!v.youtubeId) return null;

        return {
          id: doc.id,
          title: v.title,
          subtitle: v.subtitle || '',
          youtubeId: v.youtubeId,
          categoryId: v.categoryId
        };
      })
      .filter(Boolean);

    res.status(200).json(videos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao carregar vídeos' });
  }
};
