// src/pages/Contact.jsx
import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { getAllCategories } from '../services/firestoreService';
import '../styles/Contact.css';

const Contact = () => {
  const formRef = useRef();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSuccess('Mensagem enviada com sucesso!');
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container contact-page">
      <h1>Entre em Contato</h1>

      <form ref={formRef} onSubmit={sendEmail} className="contact-form">
        <div className="form-group">
          <label>Nome</label>
          <input type="text" name="name" required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input type="text" name="phone" />
        </div>

        <div className="form-group">
          <label>Categoria do assunto</label>
          <select name="category" required>
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mensagem</label>
          <textarea name="message" rows="5" required />
        </div>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar mensagem'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
