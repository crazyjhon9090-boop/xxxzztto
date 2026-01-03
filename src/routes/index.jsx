import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* =========================
   SITE PÚBLICO
========================= */
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import PostIndividual from '../pages/PostIndividual';
import CategoryPage from '../pages/CategoryPage';
import VideoCategoryPage from '../pages/VideoCategoryPage';
import Policies from '../pages/Policies';
import Privacy from '../pages/Privacy';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Logout from '../pages/Logout';
import VideoIndividual from '../pages/VideoIndividual';

/* =========================
   ADMIN
========================= */
import AdminLogin from '../admin/AdminLogin';
import AdminLayout from '../admin/AdminLayout';
import AdminDashboard from '../admin/AdminDashboard';
import AdminUsers from '../admin/AdminUsers';
import AdminUserForm from '../admin/AdminUserForm';
import AdminCategories from '../admin/AdminCategories';

/* POSTS */
import AdminPostsList from '../admin/posts/AdminPostsList';
import AdminPostForm from '../admin/posts/AdminPostForm';

/* VIDEOS */
import AdminVideosList from '../admin/videos/AdminVideosList';
import AdminVideoForm from '../admin/videos/AdminVideoForm';

/* =========================
   PROTEÇÃO
========================= */
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================
            SITE PÚBLICO
        ====================== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Conteúdo */}
          {/* Categorias */}
          <Route path="categoria/:categoryId" element={<CategoryPage />} />

          {/* Posts */}
          
          <Route path="post/:postId" element={<PostIndividual />} />
          {/* Videos */}
          <Route path="videos/:videoId" element={<VideoIndividual />} />
          <Route
          path="videos/categoria/:categoryId"
          element={<VideoCategoryPage />}
          />

          {/* Institucional */}
          <Route path="contato" element={<Contact />} />
          <Route path="policies" element={<Policies />} />
          <Route path="privacy" element={<Privacy />} />

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* =====================
            LOGIN ADMIN
        ====================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* =====================
            PAINEL ADMIN
        ====================== */}
        <Route
          path="/admin"
          element={<ProtectedRoute allow={['admin', 'editor']} />}
        >
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            {/* POSTS */}
            <Route path="posts" element={<AdminPostsList />} />
            <Route path="posts/new" element={<AdminPostForm />} />
            <Route path="posts/edit/:id" element={<AdminPostForm />} />

            {/* VIDEOS */}
            <Route path="videos" element={<AdminVideosList />} />
            <Route path="videos/new" element={<AdminVideoForm />} />
            <Route path="videos/edit/:id" element={<AdminVideoForm />} />

            {/* CATEGORIES */}
            <Route path="categories" element={<AdminCategories />} />

            {/* USERS (ADMIN ONLY) */}
            <Route
              path="users"
              element={<ProtectedRoute allow={['admin']} />}
            >
              <Route index element={<AdminUsers />} />
              <Route path="new" element={<AdminUserForm />} />
              <Route path="edit/:uid" element={<AdminUserForm />} />
            </Route>
          </Route>
        </Route>

        {/* =====================
            404
        ====================== */}
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
