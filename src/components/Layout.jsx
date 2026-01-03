
// cms-rbac-firebase/src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import '../styles/layout.css'; // Estilos de layout

// COMENTÁRIO:
// Componente de layout principal para as páginas públicas.
// Inclui o Header, o Footer e o <Outlet> para renderizar o conteúdo da página atual.

const Layout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;