// src/services/firestoreService.js

import { db, functions } from '../firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

/* =========================
   HELPERS
========================= */
const mapDocs = (snap) =>
  snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

/* =========================
   CLOUD FUNCTIONS
========================= */

/**
 * 🔐 Criação segura de usuário
 * Backend valida ADMIN / ROOT
 */
export const createUser = async ({ email, password, role }) => {
  try {
    const fn = httpsCallable(functions, 'createUser');
    const res = await fn({ email, password, role });
    return res.data;
  } catch (err) {
    console.error('createUser error:', err);

    if (err.code === 'permission-denied') {
      throw new Error('Você não tem permissão para criar usuários');
    }

    if (err.code === 'unauthenticated') {
      throw new Error('Usuário não autenticado');
    }

    throw new Error('Erro interno ao criar usuário');
  }
};

/* =========================
   GENERIC CRUD
========================= */
export const getAllDocuments = async (
  collectionName,
  orderField = 'createdAt'
) => {
  const q = query(
    collection(db, collectionName),
    orderBy(orderField, 'desc')
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
};

export const getDocumentById = async (collectionName, id) => {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists()
    ? { id: snap.id, ...snap.data() }
    : null;
};

export const addDocument = async (collectionName, data) => {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateDocument = async (collectionName, id, data) => {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
};

/* =========================
   USERS (Firestore profile)
========================= */

/**
 * Lista perfis de usuários
 * (usado no AdminUsers)
 */
export const getAllUserProfiles = async (excludeUid = null) => {
  const snap = await getDocs(collection(db, 'users'));

  const users = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return excludeUid
    ? users.filter((u) => u.id !== excludeUid)
    : users;
};

/**
 * Remove APENAS o perfil do Firestore
 * (Auth deve ser removido via Cloud Function)
 */
export const deleteUserProfile = async (uid) => {
  await deleteDoc(doc(db, 'users', uid));
};

/* =========================
   CATEGORIES
========================= */
export const getAllCategories = async () => {
  const q = query(
    collection(db, 'categories'),
    orderBy('title', 'asc')
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
};

/* =========================
   CRUD CATEGORIES
========================= */
export const addCategory = async (title) => {
  const ref = await addDoc(collection(db, 'categories'), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateCategoryName = async (id, title) => {
  await updateDoc(doc(db, 'categories', id), {
    title,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCategory = async (id) => {
  await deleteDoc(doc(db, 'categories', id));
};


/* =========================
   POSTS
========================= */
export const getAllPosts = async () =>
  getAllDocuments('posts');

export const getPostsByCategory = async (categoryId) => {
  const q = query(
    collection(db, 'posts'),
    where('categoryId', '==', categoryId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
};

export const getPostById = async (id) =>
  getDocumentById('posts', id);

export const addPost = async (data) =>
  addDocument('posts', data);

export const updatePost = async (id, data) =>
  updateDocument('posts', id, data);

export const deletePost = async (id) =>
  deleteDocument('posts', id);

/* =========================
   VIDEOS
========================= */
export const getAllVideos = async () =>
  getAllDocuments('videos');

export const getVideosByCategory = async (categoryId) => {
  const q = query(
    collection(db, 'videos'),
    where('categoryId', '==', categoryId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return mapDocs(snap);
};

export const getVideoById = async (id) =>
  getDocumentById('videos', id);

export const addVideo = async (data) =>
  addDocument('videos', data);

export const updateVideo = async (id, data) =>
  updateDocument('videos', id, data);

export const deleteVideo = async (id) =>
  deleteDocument('videos', id);
