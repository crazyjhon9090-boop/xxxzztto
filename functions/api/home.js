const admin = require('firebase-admin');
const { initAdmin } = require('../_firebase');

initAdmin();
const db = admin.firestore();

module.exports = async function home(req, res) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=600, stale-while-revalidate=300'
  );

  try {
    /* ================= CATEGORIES ================= */
    const categoriesSnap = await db.collection('categories').get();

    const categories = categoriesSnap.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title
    }));

    /* ================= POSTS ================= */
    const postsSnap = await db
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const posts = postsSnap.docs.map(doc => {
      const p = doc.data();
      return {
        id: doc.id,
        title: p.title,
        subtitle: p.subtitle || '',
        slug: p.slug,
        coverImage: p.coverImage,
        categoryId: p.categoryId
      };
    });

    /* ================= AGRUPA ================= */
    const map = {};
    categories.forEach(cat => {
      map[cat.id] = { ...cat, posts: [] };
    });

    posts.forEach(post => {
      if (map[post.categoryId] && map[post.categoryId].posts.length < 4) {
        map[post.categoryId].posts.push(post);
      }
    });

    const result = Object.values(map).filter(c => c.posts.length);

    res.status(200).json(result);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao carregar home' });
  }
};
