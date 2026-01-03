// cms-rbac-firebase/src/admin/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import {
  getAllCategories,
  addCategory,
  updateCategoryName,
  deleteCategory
} from '../services/firestoreService';


const AdminCategories = () => {
  const { hasPermission, USER_ROLES } = useAuth();

  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canEdit = hasPermission(USER_ROLES.EDITOR);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;

    try {
      await addCategory(newCategoryTitle.trim());
      setNewCategoryTitle('');
      setSuccess('Categoria adicionada com sucesso!');
      loadCategories();
    } catch (err) {
      setError('Erro ao adicionar categoria');
    }
  };

  const startEdit = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCategory.title.trim()) return;

    try {
      await updateCategoryName(
        editingCategory.id,
        editingCategory.title.trim()
      );
      setEditingCategory(null);
      setSuccess('Categoria atualizada com sucesso!');
      loadCategories();
    } catch (err) {
      setError('Erro ao atualizar categoria');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta categoria?')) return;

    try {
      await deleteCategory(id);
      setSuccess('Categoria removida com sucesso!');
      loadCategories();
    } catch (err) {
      setError('Erro ao excluir categoria');
    }
  };

  if (!canEdit) {
    return <p>Você não tem permissão para gerenciar categorias.</p>;
  }

  return (
    <div className="admin-categories">
      <h1>Gerenciar Categorias</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="card">
        <h2>Nova Categoria</h2>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Título da categoria"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            required
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>

      <div className="card">
        <h2>Categorias Cadastradas</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id}>
                {editingCategory?.id === category.id ? (
                  <form onSubmit={handleSaveEdit}>
                    <input
                      type="text"
                      value={editingCategory.title}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                    <button type="submit">Salvar</button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <span>{category.title}</span>
                    <div>
                      <button style={{ padding: "0.1rem 1rem", borderRadius: "2.5rem" }} onClick={() => startEdit(category)}>
                        Editar
                      </button>
                      <button style={{ padding: "0.1rem 1rem", borderRadius: "2.5rem" }}
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
