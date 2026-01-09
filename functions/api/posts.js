const admin = require('firebase-admin');
const { initAdmin } = require('../_firebase');

initAdmin();
const db = admin.firestore();

module.exports = async function posts(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=900, stale-while-revalidate=300'
  );

  try {
    const snap = await db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const posts = snap.docs.map(doc => {
      const p = doc.data();
      return {
        id: doc.id,
        title: p.title,
        subtitle: p.subtitle,
        coverImage: p.coverImage,
        slug: p.slug
      };
    });

    res.status(200).json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao carregar posts' });
  }
};
