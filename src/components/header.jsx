import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../contexts/CategoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X, ChevronDown } from "lucide-react";
import logo1 from "../assets/logo-ea.png";
import NewsBar from "./NewsBar";
import "../styles/header.css";

const Header = () => {
  const { categories } = useCategories();
  const { currentUser } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  /* =====================
     RESET AO VOLTAR PARA DESKTOP
  ===================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
        setMobileDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileDropdown(null);
  };

  const toggleMobileDropdown = (name) => {
    setMobileDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className="main-header">
      <NewsBar />

      <div className="header-container">
        {/* LOGO */}
        <div className="logo-wrapper">
          <img src={logo1} alt="Logo" className="logo-image" />
          <Link to="/" className="logo-text" onClick={closeMobileMenu}>
            Nome da Empresa
          </Link>
        </div>

        {/* =====================
            DESKTOP NAV
        ===================== */}
        <nav className="main-nav desktop-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/contato">Contato</Link>
            </li>

            {/* CATEGORIAS DESKTOP */}
            <li
              className={`dropdown ${
                desktopDropdown === "categories" ? "open" : ""
              }`}
              onMouseEnter={() => setDesktopDropdown("categories")}
              onMouseLeave={() => setDesktopDropdown(null)}
            >
              <button className="dropdown-toggle">
                Categorias <ChevronDown size={16} />
              </button>

              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <Link key={cat.id} to={`/categoria/${cat.id}`}>
                    {cat.title}
                  </Link>
                ))}
              </div>
            </li>

            {/* POLÍTICAS DESKTOP */}
            <li
              className={`dropdown ${
                desktopDropdown === "policies" ? "open" : ""
              }`}
              onMouseEnter={() => setDesktopDropdown("policies")}
              onMouseLeave={() => setDesktopDropdown(null)}
            >
              <button className="dropdown-toggle">
                Políticas <ChevronDown size={16} />
              </button>

              <div className="dropdown-menu">
                <Link to="/policies">Políticas</Link>
                <Link to="/privacy">Privacidade</Link>
              </div>
            </li>

            {/* LOGIN DESKTOP */}
            <li>
              {currentUser ? (
                <Link to="/logout">Logout</Link>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>

        {/* MENU TOGGLE MOBILE */}
        <div className="header-actions">
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* OVERLAY MOBILE */}
      <div
        className={`menu-overlay ${isMenuOpen ? "visible" : ""}`}
        onClick={closeMobileMenu}
      />

      {/* =====================
          MOBILE NAV
      ===================== */}
      <nav className={`main-nav mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button className="mobile-nav-close" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>

        <ul>
          <li>
            <Link to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/contato" onClick={closeMobileMenu}>
              Contato
            </Link>
          </li>

          {/* CATEGORIAS MOBILE */}
          <li
            className={`dropdown ${
              mobileDropdown === "categories" ? "open" : ""
            }`}
          >
            <button
              className="dropdown-toggle"
              onClick={() => toggleMobileDropdown("categories")}
            >
              Categorias <ChevronDown size={16} />
            </button>

            <div className="dropdown-menu">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categoria/${cat.id}`}
                  onClick={closeMobileMenu}
                >
                  {cat.title}
                </Link>
              ))}
            </div>
          </li>

          {/* POLÍTICAS MOBILE */}
          <li
            className={`dropdown ${
              mobileDropdown === "policies" ? "open" : ""
            }`}
          >
            <button
              className="dropdown-toggle"
              onClick={() => toggleMobileDropdown("policies")}
            >
              Políticas <ChevronDown size={16} />
            </button>

            <div className="dropdown-menu">
              <Link to="/policies" onClick={closeMobileMenu}>
                Políticas
              </Link>
              <Link to="/privacy" onClick={closeMobileMenu}>
                Privacidade
              </Link>
            </div>
          </li>

          {/* LOGIN MOBILE */}
          <li className="mobile-nav-cta">
            {currentUser ? (
              <Link
                to="/logout"
                className="btn-primary-full"
                onClick={closeMobileMenu}
              >
                Logout
              </Link>
            ) : (
              <Link
                to="/login"
                className="btn-primary-full"
                onClick={closeMobileMenu}
              >
                Fazer Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
