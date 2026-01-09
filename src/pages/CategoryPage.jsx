import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllPosts, getAllCategories } from "../services/firestoreService";
import PostCard from "../components/PostCard";
import SidebarContainer from "../components/sidebars/SidebarContainer";
import "../styles/category.css";
import "../styles/layout-base.css"; // ✅ OBRIGATÓRIO

const POSTS_PER_PAGE = 9;

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryId, page]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [allPosts, categories] = await Promise.all([
        getAllPosts(),
        getAllCategories(),
      ]);

      const currentCategory = categories.find(
        (cat) => cat.id === categoryId
      );
      setCategory(currentCategory || null);

      const filteredPosts = allPosts.filter(
        (post) => post.categoryId === categoryId
      );

      const start = (page - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;

      setPosts(filteredPosts.slice(start, end));
    } catch (err) {
      console.error("Erro ao carregar categoria:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => setSearchParams({ page: page + 1 });
  const prevPage = () => setSearchParams({ page: page - 1 });

  return (
    <div className="page-container category-page">
      <h1 className="category-title">
        {category ? category.title : "Categoria"}
      </h1>

      <div className="page-layout category-layout">
        {/* CONTEÚDO */}
        <div className="page-article category-article">
          {loading && <p>Carregando posts...</p>}

          {!loading && posts.length === 0 && (
            <p className="empty">
              Nenhuma publicação encontrada nesta categoria.
            </p>
          )}

          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                categoryName={category?.title}
              />
            ))}
          </div>

          {!loading && posts.length > 0 && (
            <div className="pagination">
              {page > 1 && (
                <button onClick={prevPage}>← Anterior</button>
              )}
              <span>Página {page}</span>
              {posts.length === POSTS_PER_PAGE && (
                <button onClick={nextPage}>Próxima →</button>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <SidebarContainer />
      </div>
    </div>
  );
};

export default CategoryPage;
