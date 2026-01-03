import React, { useEffect, useState } from 'react';
import {
  addVideo,
  getDocumentById,
  updateVideo,
  getAllCategories
} from '../../services/firestoreService';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/AdminVideos.css';

const AdminVideoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [iframe, setIframe] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    if (id) loadVideo();
  }, [id]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadVideo = async () => {
    const video = await getDocumentById('videos', id);
    if (!video) return;

    setTitle(video.title);
    setSubtitle(video.subtitle || '');
    setDescription(video.description || '');
    setIframe(video.iframe);
    setCategoryId(video.categoryId || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      subtitle,
      description,
      iframe,
      categoryId,
    };

    if (id) {
      await updateVideo(id, data);
    } else {
      await addVideo(data);
    }

    navigate('/admin/videos');
  };

  return (
    <div className="page-container admin-videos">
      <h1>{id ? 'Editar Vídeo' : 'Novo Vídeo'}</h1>

      <form className="video-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subtítulo (opcional)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <textarea
          placeholder="Descrição do vídeo"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Cole o iframe do vídeo"
          value={iframe}
          onChange={(e) => setIframe(e.target.value)}
          required
        />

        <button type="submit">
          {id ? 'Atualizar Vídeo' : 'Adicionar Vídeo'}
        </button>
      </form>
    </div>
  );
};

export default AdminVideoForm;

