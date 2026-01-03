import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/SidebarContactCTA.css';

const SidebarContactCTA = () => {
  return (
    <aside className="sidebar-contact">
      <h3>Precisa de ajuda?</h3>

      <p>
        Quer ajuda com algum dos tópicos?
        Entre em contato para mais informações.
      </p>

      <Link to="/contato" className="contact-btn">
        Falar com a equipe
      </Link>
    </aside>
  );
};

export default SidebarContactCTA;
