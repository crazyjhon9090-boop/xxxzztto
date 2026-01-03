import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../contexts/CategoryContext";
import { useAuth } from "../contexts/AuthContext";
import logo1 from "../assets/logo-ea.png";
import NewsBar from "./NewsBar";
import "../styles/header.css";

const Header = () => {
  const { categories } = useCategories();
  const { currentUser } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest(".dropdown")) setOpenDropdown(null);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="main-header">

      {/* 📰 NEWSBAR */}
      <NewsBar />

      <div className="header-container">

        {/* LOGO */}
        <div className="logo-wrapper">
          <img className="logo-image" src={logo1} alt="Logo" />
          <Link to="/" className="logo-text">Nome da Empresa</Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(prev => !prev)}
        >
          ☰
        </button>

        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <ul>

            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>

            <li>
              <Link to="/contato" onClick={() => setIsMenuOpen(false)}>
                Contato
              </Link>
            </li>

            {/* =========================
                CATEGORIAS
            ========================= */}
            <li
              className={`dropdown ${openDropdown === "categories" ? "open" : ""}`}
              onMouseEnter={() => setOpenDropdown("categories")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <span
                className="dropdown-toggle"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "categories" ? null : "categories"
                  )
                }
              >
                Categorias <span className="arrow">▾</span>
              </span>

              <ul className="dropdown-menu">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/categoria/${cat.id}`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      {cat.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* =========================
                POLÍTICAS
            ========================= */}
            <li
              className={`dropdown ${openDropdown === "policies" ? "open" : ""}`}
              onMouseEnter={() => setOpenDropdown("policies")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <span
                className="dropdown-toggle"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "policies" ? null : "policies"
                  )
                }
              >
                Políticas <span className="arrow">▾</span>
              </span>

              <ul className="dropdown-menu">
                <li>
                  <Link to="/policies">Políticas</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacidade</Link>
                </li>
              </ul>
            </li>

            {/* LOGIN */}
            <li>
              {currentUser ? (
                <Link to="/logout" className="admin-link">
                  Logout
                </Link>
              ) : (
                <Link to="/login" className="admin-link">
                  Login
                </Link>
              )}
            </li>

          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
