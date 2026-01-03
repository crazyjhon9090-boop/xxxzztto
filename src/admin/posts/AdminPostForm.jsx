import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  addPost,
  updatePost,
  getDocumentById,
  getAllCategories,
} from '../../services/firestoreService';

import { uploadImage } from '../../services/storageService';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';


import '../../styles/AdminPostsForm.css';

const AdminPostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [gallery, setGallery] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: '',
  });

  useEffect(() => {
    loadCategories();
    if (id) loadPost();
  }, [id]);

  const loadCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const loadPost = async () => {
    const post = await getDocumentById('posts', id);
    if (!post) return;

    setTitle(post.title);
    setSubtitle(post.subtitle || '');
    setSlug(post.slug || '');
    setCategoryId(post.categoryId || '');

    setCoverPreview(post.coverImage || null);
    setGalleryPreview(post.gallery || []);

    editor?.commands.setContent(post.content || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coverImageUrl = coverPreview;
    let galleryUrls = galleryPreview;

    if (coverImage) {
      coverImageUrl = await uploadImage(
        coverImage,
        `posts/covers/${Date.now()}-${coverImage.name}`
      );
    }

    if (gallery.length > 0) {
      galleryUrls = await Promise.all(
        gallery.map(file =>
          uploadImage(
            file,
            `posts/gallery/${Date.now()}-${file.name}`
          )
        )
      );
    }

    const data = {
      title,
      subtitle,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      categoryId,
      coverImage: coverImageUrl,
      gallery: galleryUrls,
      content: editor.getHTML(),
    };

    id ? await updatePost(id, data) : await addPost(data);
    navigate('/admin/posts');
  };

  return (
    <div className="page-container admin-post-form">
      <h1>{id ? 'Editar Post' : 'Novo Post'}</h1>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Subtítulo (opcional)"
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Slug (opcional)"
          value={slug}
          onChange={e => setSlug(e.target.value)}
        />

        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>

        {/* CAPA */}
        <label>Capa do Post</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            setCoverImage(file);
            setCoverPreview(URL.createObjectURL(file));
          }}
          required={!id}
        />

        {coverPreview && (
          <img src={coverPreview} className="image-preview" />
        )}

        {/* EDITOR */}
        <div className="editor-container">
          <label>Conteúdo</label>
          <EditorContent editor={editor} />
        </div>

        {/* GALERIA */}
        <label>Imagens do Carrossel</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            const files = Array.from(e.target.files);
            setGallery(files);
            setGalleryPreview(files.map(file => URL.createObjectURL(file)));
          }}
        />

        <div className="gallery-preview">
          {galleryPreview.map((img, index) => (
            <img key={index} src={img} />
          ))}
        </div>

        <button type="submit" className="btn-primary">
          {id ? 'Atualizar Post' : 'Publicar Post'}
        </button>
      </form>
    </div>
  );
};

export default AdminPostForm;
