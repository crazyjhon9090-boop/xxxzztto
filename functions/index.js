const { onCall, onRequest, HttpsError } =
  require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

/* =====================================================
   🔐 CALLABLE FUNCTIONS (RBAC)
===================================================== */

exports.createUser = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { auth, data } = request;

    if (!auth) {
      throw new HttpsError('unauthenticated', 'Usuário não autenticado');
    }

    const requesterRole = auth.token.role;

    if (!['admin', 'root_admin'].includes(requesterRole)) {
      throw new HttpsError(
        'permission-denied',
        'Apenas administradores podem criar usuários'
      );
    }

    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new HttpsError('invalid-argument', 'Dados inválidos');
    }

    const user = await admin.auth().createUser({ email, password });

    await admin.auth().setCustomUserClaims(user.uid, { role });

    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: user.uid, email, role };
  }
);

/* =====================================================
   🔐 OUTRA CALLABLE
===================================================== */

exports.setUserRole =
  require('./callable/setUserRole').setUserRole;

/* =====================================================
   🌍 HTTP API (fetch)
===================================================== */

const home = require('./api/home');
const sidebar = require('./api/sidebar');
const posts = require('./api/posts');
const videos = require('./api/videos');
const news = require('./api/news');


exports.api = onRequest(
  { 
    region: 'us-central1',
    secrets: ['GNEWS_API_KEY'], // 👈 Adicionando o secret do API de Noticias
   },
  
  (req, res) => {
    cors(req, res, async () => {
      try {
        const route = req.path.replace('/', '');

        if (route === 'home') return home(req, res);
        if (route === 'sidebar') return sidebar(req, res);
        if (route === 'posts') return posts(req, res);
        if (route === 'videos') return videos(req, res);
        if (route === 'news') return news(req, res);
 
        res.status(404).json({ error: 'Rota não encontrada' });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro interno' });
      }
    });
  }
);
