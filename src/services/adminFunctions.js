import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase/config';

// 🔥 SEMPRE usar a mesma região das functions
const functions = getFunctions(app, 'us-central1');

/**
 * 🔐 Apenas ROOT_ADMIN pode chamar
 */
export const updateUserRole = async (uid, role) => {
  try {
    const setRole = httpsCallable(functions, 'setUserRole');
    await setRole({ uid, role });
  } catch (error) {
    console.error('Erro ao atualizar role:', error);

    // Mensagem amigável vinda do backend
    throw new Error(
      error?.message || 'Erro ao atualizar permissão do usuário'
    );
  }
};
