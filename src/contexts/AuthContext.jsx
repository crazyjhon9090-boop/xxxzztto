import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext();

/**
 * ROLES DO SISTEMA
 * (DEVEM SER STRING — IGUAL AO CUSTOM CLAIM)
 */
export const USER_ROLES = {
  ROOT: 'root_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
};

/**
 * HIERARQUIA DE PERMISSÕES
 */
const ROLE_HIERARCHY = {
  [USER_ROLES.ROOT]: [
    USER_ROLES.ROOT,
    USER_ROLES.ADMIN,
    USER_ROLES.EDITOR,
    USER_ROLES.USER,
  ],
  [USER_ROLES.ADMIN]: [
    USER_ROLES.ADMIN,
    USER_ROLES.EDITOR,
    USER_ROLES.USER,
  ],
  [USER_ROLES.EDITOR]: [
    USER_ROLES.EDITOR,
    USER_ROLES.USER,
  ],
  [USER_ROLES.USER]: [
    USER_ROLES.USER,
  ],
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        // FORÇA ATUALIZAÇÃO DO TOKEN (importantíssimo)
        const tokenResult = await user.getIdTokenResult(true);

        setCurrentUser({
          uid: user.uid,
          email: user.email,
          role: tokenResult.claims.role || USER_ROLES.USER,
        });
      } catch (error) {
        console.error('Erro ao obter token:', error);
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /**
   * LOGIN / LOGOUT
   */
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  /**
   * VERIFICA PERMISSÃO
   * Ex: hasPermission(USER_ROLES.ADMIN)
   */
  const hasPermission = (requiredRole) => {
    if (!currentUser) return false;

    return ROLE_HIERARCHY[currentUser.role]?.includes(requiredRole);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        hasPermission,
        USER_ROLES,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
