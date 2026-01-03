const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * 🔐 Criação segura de usuário
 * ADMIN e ROOT_ADMIN
 */
exports.createUser = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { auth, data } = request;

    // 🔒 Autenticação
    if (!auth) {
      throw new HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    // 🔒 Autorização (ADMIN OU ROOT)
    const requesterRole = auth.token.role;

    if (!['admin', 'root_admin'].includes(requesterRole)) {
      throw new HttpsError(
        'permission-denied',
        'Apenas administradores podem criar usuários'
      );
    }

    const { email, password, role } = data;

    if (!email || !password || !role) {
      throw new HttpsError(
        'invalid-argument',
        'Dados inválidos'
      );
    }

    // 👤 Criar usuário no Auth
    const user = await admin.auth().createUser({
      email,
      password,
    });

    // 🎭 Custom Claims
    await admin.auth().setCustomUserClaims(user.uid, { role });

    // 📄 Firestore profile
    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      uid: user.uid,
      email,
      role,
    };
  }
);

exports.setUserRole = require('./setUserRole').setUserRole;
