import React, { useEffect, useState } from 'react';
import { getAllVideos } from '../../services/firestoreService';
import { useCategories } from '../../contexts/CategoryContext';
import { Link } from 'react-router-dom';
import '../../styles/SidebarVideos.css';

const SidebarVideos = () => {
  const [videos, setVideos] = useState([]);
  const { categories } = useCategories();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await getAllVideos();
    setVideos(data.slice(0, 4)); // 🔥 4 mais recentes
  };

  return (
    <aside className="sidebar-videos">

      {/* ===== VÍDEOS RECENTES ===== */}
      <h3 className="sidebar-title">Vídeos Recentes</h3>

      {videos.map((video) => (
        <div className="video-card" key={video.id}>
          <div
            className="video-iframe"
            dangerouslySetInnerHTML={{ __html: video.iframe }}
          />

          <Link to={`/videos/${video.id}`} className="video-title">
            {video.title}
          </Link>

          {video.subtitle && (
            <p className="video-subtitle">{video.subtitle}</p>
          )}
        </div>
      ))}

      {/* ===== FILTRO POR CATEGORIA ===== */}
      {categories.length > 0 && (
        <>
          <h4 className="categories-title">Categorias</h4>

          <div className="category-buttons">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/videos/categoria/${cat.id}`}
                className="category-btn"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </>
      )}

    </aside>
  );
};

export default SidebarVideos;
