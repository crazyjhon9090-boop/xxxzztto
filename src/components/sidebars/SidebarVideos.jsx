import { useEffect, useState } from 'react';
import { useCategories } from '../../contexts/CategoryContext';
import { Link } from 'react-router-dom';
import VideoPreview from './VideoPreview';
import '../../styles/SidebarVideos.css';

const SidebarVideos = () => {
  const [videos, setVideos] = useState([]);
  const { categories } = useCategories();

  useEffect(() => {
    fetch('https://us-central1-base-6a18c.cloudfunctions.net/api/sidebar')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro ao buscar /api/sidebar');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.videos)) {
          setVideos(data.videos.filter(v => v.youtubeId));
        }
      })
      .catch(err => {
        console.error('Erro sidebar vídeos:', err);
      });
  }, []);

  return (
    <aside className="sidebar-videos">
      <h3 className="sidebar-title">Vídeos Recentes</h3>

      <div className="videos-list">
        {videos.length > 0 ? (
          videos.map(video => (
            <VideoPreview key={video.id} video={video} />
          ))
        ) : (
          <p className="sidebar-empty">Nenhum vídeo disponível</p>
        )}
      </div>

      {categories.length > 0 && (
        <section className="video-categories">
          <h4 className="categories-title">Categorias</h4>

          <div className="category-buttons">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/videos/categoria/${cat.id}`}
                className="category-btn"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default SidebarVideos;
