import React, { useEffect, useState } from 'react';
import {
  getAllPosts,
  deletePost,
  getAllCategories
} from '../../services/firestoreService';
import { Link } from 'react-router-dom';
import '../../styles/AdminPosts.css';
import '../../styles/AdminPostsList.css';

const AdminPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const postsData = await getAllPosts();
    const categoriesData = await getAllCategories();

    const map = {};
    categoriesData.forEach(cat => {
      map[cat.id] = cat.title;
    });

    setCategories(map);
    setPosts(postsData);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este post?')) return;
    await deletePost(id);
    loadData();
  };

  const stripHtml = (html) =>
    html?.replace(/<[^>]+>/g, '').slice(0, 80) + '...';

  return (
    <div className="page-container admin-posts">
      <div className="admin-header">
        <h1>Posts</h1>
        <Link to="/admin/posts/new" className="btn-primary">
          + Novo Post
        </Link>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Subtítulo</th>
              <th>Slug</th>
              <th>Categoria</th>
              <th>Conteúdo</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.subtitle || '—'}</td>
                <td>{post.slug}</td>
                <td>{categories[post.categoryId] || '—'}</td>
                <td>{stripHtml(post.content)}</td>
                <td>
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleDateString()
                    : '—'}
                </td>
                <td className="actions">
                  <Link
                    to={`/admin/posts/edit/${post.id}`}
                    className="btn-edit"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="btn-delete"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <p className="empty">Nenhum post cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPostsList;
