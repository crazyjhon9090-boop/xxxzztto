import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg';
import '../styles/post-card.css';

const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, '');

const PostCard = ({ post, categoryName }) => {
  if (!post) return null;

  const imageSrc = post.coverImage || defaultImage;

  const date = post.createdAt?.toDate
    ? post.createdAt.toDate()
    : new Date(post.createdAt || Date.now());

  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' });

  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`} className="post-image-wrapper">
        <img src={imageSrc} alt={post.title || 'Post'} />

        <span className="post-category">
          {categoryName || 'Geral'}
        </span>

        <span className="post-date">
          {day} {month}
        </span>
      </Link>

      <div className="post-content">
        <h3>{post.title || 'Título do Post'}</h3>

        <p>
          {post.subtitle && post.subtitle.length > 80
            ? post.subtitle
            : stripHtml(post.content || '').slice(0, 220)}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
