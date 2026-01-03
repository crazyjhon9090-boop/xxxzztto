import React, { useEffect, useState } from 'react';
import { getAllPosts, getAllCategories } from '../services/firestoreService';
import PostCard from '../components/PostCard';
import SidebarContainer from '../components/sidebars/SidebarContainer';
import AboutAccordion from '../components/AboutAccordion';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import '../styles/Home.css';
import '../styles/pages.css';

const Home = () => {
  const [postsByCategory, setPostsByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const [posts, categories] = await Promise.all([
        getAllPosts(),
        getAllCategories(),
      ]);

      const categoriesMap = {};
      categories.forEach((cat) => {
        categoriesMap[cat.id] = { ...cat, posts: [] };
      });

      posts.forEach((post) => {
        if (categoriesMap[post.categoryId]) {
          categoriesMap[post.categoryId].posts.push(post);
        }
      });

      const result = Object.values(categoriesMap)
        .filter((cat) => cat.posts.length > 0)
        .map((cat) => ({
          ...cat,
          posts: cat.posts.slice(0, 4),
        }));

      setPostsByCategory(result);
    } catch (error) {
      console.error('Erro ao carregar Home:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container home-page">
      <h1>Últimas Publicações</h1>

      <div className="home-layout">
        {/* COLUNA PRINCIPAL */}
        <div>
          {loading && <p>Carregando publicações...</p>}

          {!loading &&
            postsByCategory.map((category) => (
              <section key={category.id} className="category-section">
                <div className="category-header">
                  <h2>{category.title}</h2>
                  <Link
                    to={`/categoria/${category.id}`}
                    className="view-all-btn"
                  >
                    Ver tudo →
                  </Link>
                </div>

                <div className="posts-grid">
                  {category.posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      categoryName={category.title}
                      
                    />
                  ))}
                </div>
              </section>
            ))}

          {/* SOBRE NÓS */}
          <section className="about-section">
            <div className="about-logo-wrapper">
              <img
                src={logo}
                alt="Quem somos"
                className="about-image"
              />
            </div>

            <div className="about-content">
              <h2>Sobre Nós</h2>
              <AboutAccordion />
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <SidebarContainer />
      </div>
    </div>
  );
};

export default Home;
