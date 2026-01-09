import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getAllVideos, getAllCategories } from '../services/firestoreService';
import SidebarVideos from '../components/sidebars/SidebarVideos';
import '../styles/videos-category.css';
import '../styles/pages.css';
import "../styles/layout-base.css";

const VIDEOS_PER_PAGE = 6;

const VideoCategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [allVideos, categories] = await Promise.all([
        getAllVideos(),
        getAllCategories(),
      ]);

      const currentCategory = categories.find(
        (cat) => cat.id === categoryId
      );

      setCategory(currentCategory || null);

      const filtered = allVideos.filter(
        (video) => video.categoryId === categoryId
      );

      setVideos(filtered);
    } catch (err) {
      console.error('Erro ao carregar vídeos da categoria:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);

  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * VIDEOS_PER_PAGE;
    const end = start + VIDEOS_PER_PAGE;
    return videos.slice(start, end);
  }, [videos, currentPage]);

  const goToPage = (page) => {
    setSearchParams({ page });
  };

  return (
    <div className="page-container videos-category-page">
      <h1 className="page-title">
        {category ? category.title : 'Vídeos'}
      </h1>

      <div className="page-layout videos-category-layout">
        {/* CONTEÚDO */}
        <div className="page-article videos-category-article">
          {loading && <p>Carregando vídeos...</p>}

          {!loading && videos.length === 0 && (
            <p className="empty">
              Nenhum vídeo encontrado nesta categoria.
            </p>
          )}

          {!loading && videos.length > 0 && (
            <>
              <div className="videos-grid">
                {paginatedVideos.map((video) => (
                  <div className="video-card" key={video.id}>
                    <div className="video-iframe">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>

                    <h3 className="video-title">
                      <Link
                        to={`/videos/${video.id}`}
                        className="video-title-link"
                      >
                        {video.title}
                      </Link>
                    </h3>

                    {video.subtitle && (
                      <p className="video-subtitle">
                        {video.subtitle}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    ← Anterior
                  </button>

                  <span>
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* SIDEBAR */}
        <SidebarVideos />
      </div>
    </div>
  );
};

export default VideoCategoryPage;
