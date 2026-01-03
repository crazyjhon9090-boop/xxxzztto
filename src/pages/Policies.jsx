// src/pages/Policies.jsx
import { Link } from 'react-router-dom';
import React from 'react';
import '../styles/policies.css';

const Policies = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">

        {/* SIDEBAR */}
        <aside className="legal-sidebar">
          <h3>Documentos Legais</h3>
          <ul>
            <li className="active">Políticas do Site</li>
            <li> <Link to="/privacy">Privacidade</Link></li>
            <li><Link to="/policies"> Políticas</Link></li>
          </ul>
        </aside>

        {/* CONTEÚDO */}
        <main className="legal-content">
          <h1>Políticas do Site</h1>
          <p className="legal-intro">
            Estas políticas explicam como o site funciona, quais são suas responsabilidades
            e como tratamos informações e conteúdos disponibilizados.
          </p>

          <section>
            <h2>1. Termos de Uso</h2>
            <p>
              Ao acessar e utilizar este site, você concorda em cumprir os termos e condições aqui descritos.
              Caso não concorde com algum ponto, recomendamos que não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2>2. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente neste site, incluindo textos, imagens, logotipos e códigos,
              é protegido por direitos autorais e pertence ao site ou a seus licenciadores.
            </p>
          </section>
        </main>

      </div>
    </div>
  );
};

export default Policies;
