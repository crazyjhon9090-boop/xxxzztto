import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USER_ROLES } from '../contexts/AuthContext';
import {
  getAllUserProfiles,
  deleteUserProfile
} from '../services/firestoreService';

import '../styles/AdminUsers.css';

const AdminUsers = () => {
  const { currentUser, hasPermission } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canManageUsers = hasPermission(USER_ROLES.ADMIN);

  const loadUsers = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const data = await getAllUserProfiles(currentUser.uid);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
    }
  }, [canManageUsers]);

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este usuário?'
    );

    if (!confirmDelete) return;

    try {
      await deleteUserProfile(uid);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir usuário');
    }
  };

  if (!canManageUsers) {
    return (
      <div className="admin-users">
        <p className="error-message">
          Você não tem permissão para acessar esta área.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>Usuários</h1>

        <button
          className="btn-primary"
          onClick={() => navigate('/admin/users/new')}
        >
          + Novo Usuário
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-card">
        {loading ? (
          <p>Carregando...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum usuário encontrado</h3>
            <p>Apenas você está cadastrado.</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>UID</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="uid">{user.id}</td>
                  <td>{user.email || '—'}</td>
                  <td>{(user.role || 'user').toUpperCase()}</td>
                  <td className="actions">
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        navigate(`/admin/users/edit/${user.id}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
