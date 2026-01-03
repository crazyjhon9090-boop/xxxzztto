import React, { useEffect, useState } from 'react';
import {
  getAllVideos,
  deleteVideo,
  getAllCategories
} from '../../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminVideosList.css';

const AdminVideosList = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
    loadCategories();
  }, []);

  const loadVideos = async () => {
    const data = await getAllVideos();
    setVideos(data);
  };

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir vídeo?')) return;
    await deleteVideo(id);
    loadVideos();
  };

  const getCategoryTitle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.title : '—';
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '—';
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <div className="page-container admin-videos">
      <div className="page-header">
        <h1>Vídeos</h1>

        <button
          className="btn-primary"
          onClick={() => navigate('/admin/videos/new')}
        >
          + Novo Vídeo
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoria</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {videos.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  Nenhum vídeo cadastrado
                </td>
              </tr>
            ) : (
              videos.map(video => (
                <tr key={video.id}>
                  <td>{video.title}</td>
                  <td>{getCategoryTitle(video.categoryId)}</td>
                  <td>{formatDate(video.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/admin/videos/edit/${video.id}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(video.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVideosList;
