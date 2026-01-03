// cms-rbac-firebase/src/admin/AdminLayout.jsx

import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/admin.css';

const AdminLayout = () => {
  const { currentUser, logout, USER_ROLES } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) {
    return <div>Erro: Usuário não autenticado.</div>;
  }

  const userRole = currentUser.role;

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate('/login'); // ou "/" se preferir
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="admin-layout">
      {/* Botão mobile */}
      <button
        className="admin-menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>CMS Admin</h2>
          <p>{userRole.toUpperCase()}</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin" onClick={closeMenu}>
            Dashboard
          </Link>
         {(userRole === USER_ROLES.ADMIN || 
            userRole === USER_ROLES.ROOT) && (
            <Link to="/admin/users" onClick={closeMenu}>
              Usuários
            </Link>
          )}

          {(userRole === USER_ROLES.ADMIN ||
            userRole === USER_ROLES.EDITOR) && (
            <>
              <Link to="/admin/posts" onClick={closeMenu}>
                Posts
              </Link>
              <Link to="/admin/categories" onClick={closeMenu}>
                Categorias
              </Link>
            </>
          )}

          {userRole === USER_ROLES.ADMIN && (
            <Link to="/admin/videos" onClick={closeMenu}>
              Vídeos
            </Link>
          )}
        </nav>

        {/* 🔐 Logout real */}
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;