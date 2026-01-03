import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allow }) => {
  const { currentUser, loading, hasPermission } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const hasAccess = allow.some((role) =>
    hasPermission(role)
  );

  if (!hasAccess) {
    console.warn(
      `Acesso negado | UID: ${currentUser.uid} | Role: ${currentUser.role}`
    );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
