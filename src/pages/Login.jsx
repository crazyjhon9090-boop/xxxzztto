import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // 👈 ESSENCIAL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (import.meta.env.DEV) {
        console.log('Login realizado:', email);
      }

      navigate('/');
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');

    if (!email) {
      setError('Informe seu e-mail para recuperar a senha.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('E-mail de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (err) {
      setError('Erro ao enviar e-mail de recuperação.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Entrar</h1>
        <p>Acesse sua conta</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        <p className="register-text">
          Não tem conta?{' '}
          <Link to="/register" className="register-link">
            Criar cadastro
          </Link>
        </p>

        <button
          type="button"
          className="forgot-password"
          onClick={handlePasswordReset}
        >
          Esqueceu sua senha?
        </button>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
