const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

// 🔒 ROLES VÁLIDAS DO SISTEMA
const ALLOWED_ROLES = ['user', 'editor', 'admin', 'root_admin'];

exports.setUserRole = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { auth, data } = request;

    /* =========================
       AUTH
    ========================= */
    if (!auth) {
      throw new HttpsError(
        'unauthenticated',
        'Usuário não autenticado'
      );
    }

    if (auth.token.role !== 'root_admin') {
      throw new HttpsError(
        'permission-denied',
        'Apenas ROOT_ADMIN pode alterar roles'
      );
    }

    /* =========================
       DATA VALIDATION
    ========================= */
    const { uid, role } = data;

    if (!uid || !role) {
      throw new HttpsError(
        'invalid-argument',
        'UID e role são obrigatórios'
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      throw new HttpsError(
        'invalid-argument',
        'Role inválida'
      );
    }

    /* =========================
       PROTEÇÃO EXTRA
    ========================= */

    // 🔥 Impede ROOT_ADMIN de remover o próprio acesso sem querer
    if (uid === auth.uid && role !== 'root_admin') {
      throw new HttpsError(
        'failed-precondition',
        'ROOT_ADMIN não pode remover seu próprio privilégio'
      );
    }

    /* =========================
       UPDATE CLAIMS
    ========================= */
    await admin.auth().setCustomUserClaims(uid, { role });

    /* =========================
       SYNC FIRESTORE
    ========================= */
    await admin.firestore().collection('users').doc(uid).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    /* =========================
       AUDIT LOG
    ========================= */
    await admin.firestore().collection('audit_logs').add({
      action: 'SET_USER_ROLE',
      targetUid: uid,
      newRole: role,
      performedBy: auth.uid,
      performerRole: auth.token.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      uid,
      role,
    };
  }
);
