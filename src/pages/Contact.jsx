import React, { useState } from "react";
import SidebarContainer from "../components/sidebars/SidebarContainer";
import "../styles/Contact.css";
import "../styles/layout-base.css";

const Contact = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      const formData = new FormData(e.target);

      const res = await fetch("https://SEUSITE.com/contact.php", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("Mensagem enviada com sucesso!");
        e.target.reset();
      } else {
        setStatus("Erro ao enviar. Tente novamente.");
      }
    } catch {
      setStatus("Falha na conexão.");
    }
  };

  return (
    <div className="page-container contact-page">
      <h1>Entre em Contato</h1>
      <p className="page-subtitle">
        Fale com nosso SAC — dúvidas, sugestões ou suporte.
      </p>

      <div className="contact-layout">
        {/* CONTEÚDO PRINCIPAL */}
        <div className="contact-content">
          <div className="contact-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Nome</label>
              <input type="text" name="name" required />

              <label>E-mail</label>
              <input type="email" name="email" required />

              <label>Mensagem</label>
              <textarea name="message" rows="5" required />

              <button type="submit" className="contact-btn">
                Enviar mensagem
              </button>

              {status && <p className="form-status">{status}</p>}
            </form>
          </div>
        </div>

        {/* SIDEBAR GLOBAL */}
        <SidebarContainer />
      </div>
    </div>
  );
};

export default Contact;
