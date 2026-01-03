// cms-rbac-firebase/src/admin/AdminDashboard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useAuth, USER_ROLES } from "../contexts/AuthContext";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  return (
    <div className="admin-dashboard">
      <h1>Painel Administrativo</h1>
      <p className="admin-subtitle">Escolha uma área para gerenciar</p>

      <div className="admin-cards">
        <Link to="/admin/posts" className="admin-card">
          <span className="icon">📝</span>
          <strong>Posts</strong>
          <small>Criar, editar e excluir posts</small>
        </Link>

        <Link to="/admin/videos" className="admin-card">
          <span className="icon">🎥</span>
          <strong>Vídeos</strong>
          <small>Gerenciar vídeos</small>
        </Link>

        <Link to="/admin/categories" className="admin-card">
          <span className="icon">📂</span>
          <strong>Categorias</strong>
          <small>Organizar conteúdos</small>
        </Link>

        {(role === USER_ROLES.ADMIN || role === USER_ROLES.ROOT) && (
          <Link to="/admin/users" className="admin-card">
            <span className="icon">👤</span>
            <strong>Usuários</strong>
            <small>Permissões e roles</small>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
