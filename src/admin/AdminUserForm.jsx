import React, { useState } from 'react';
import { createUser } from '../services/firestoreService';
import { useAuth, USER_ROLES } from '../contexts/AuthContext';

const AdminUserForm = () => {
  const { currentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(USER_ROLES.USER);
  const [loading, setLoading] = useState(false);

  const isRoot = currentUser.role === USER_ROLES.ROOT;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === USER_ROLES.ROOT && !isRoot) {
      alert('Apenas ROOT_ADMIN pode criar outro ROOT_ADMIN');
      return;
    }

    try {
      setLoading(true);
      await createUser({ email, password, role });
      alert('Usuário criado com sucesso');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Usuário</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value={USER_ROLES.USER}>User</option>
        <option value={USER_ROLES.EDITOR}>Editor</option>
        <option value={USER_ROLES.ADMIN}>Admin</option>

        {isRoot && (
          <option value={USER_ROLES.ROOT}>Root Admin</option>
        )}
      </select>

      <button disabled={loading}>
        {loading ? 'Criando...' : 'Criar Usuário'}
      </button>
    </form>
  );
};

export default AdminUserForm;

