import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom';
import '../styles/Logout.css';

const Logout = () => {
  useEffect(() => {
    signOut(auth);
  }, []);

  return (
    <div className="logout-page">
      <div className="logout-card">
        <h1>Logout realizado</h1>
        <p>Você saiu da sua conta com sucesso.</p>

        <Link to="/" className="btn-home">
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default Logout;
