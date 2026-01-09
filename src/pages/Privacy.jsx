import React from "react";
import { Link } from "react-router-dom";
import "../styles/legal.css";

const Privacy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">

        {/* SIDEBAR */}
        <aside className="legal-sidebar">
          <h3>Documentos Legais</h3>
          <ul>
            <li>
              <Link to="/policies">Políticas do Site</Link>
            </li>
            <li className="active">
              Política de Privacidade
            </li>
          </ul>
        </aside>

        {/* CONTEÚDO */}
        <main className="legal-content">
          <h1>Política de Privacidade</h1>

          <p className="legal-intro">
            Esta Política de Privacidade descreve como coletamos, utilizamos
            e protegemos as informações dos usuários que acessam o site.
          </p>

          <section>
            <h2>1. Coleta de Informações</h2>
            <p>
              Coletamos informações pessoais apenas quando estritamente necessárias,
              sempre de forma transparente e com o consentimento do usuário.
            </p>
          </section>

          <section>
            <h2>2. Uso dos Dados</h2>
            <p>
              Os dados coletados são utilizados exclusivamente para melhorar
              a experiência do usuário, garantir segurança e cumprir obrigações legais.
            </p>
          </section>

          <section>
            <h2>3. Compartilhamento</h2>
            <p>
              Não compartilhamos informações pessoais com terceiros, exceto quando
              exigido por lei ou mediante autorização explícita do usuário.
            </p>
          </section>

          <section>
            <h2>4. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger os dados
              contra acessos não autorizados, vazamentos ou alterações indevidas.
            </p>
          </section>

        </main>

      </div>
    </div>
  );
};

export default Privacy;
