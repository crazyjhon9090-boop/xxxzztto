// src/pages/PostIndividual.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { animate } from "animejs";
import SidebarContainer from "../components/sidebars/SidebarContainer";
import GalleryCarousel from "../components/GalleryCarousel";
import { getDocumentById } from "../services/firestoreService";
import "../styles/post-individual.css";
import "../styles/layout-base.css";

const PostIndividual = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  useEffect(() => {
    if (!post || animatedRef.current) return;
    animatedRef.current = true;

    animate(containerRef.current, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      easing: "easeOutQuad",
    });

    animate(titleRef.current.querySelectorAll("span"), {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: (_, i) => i * 35,
      easing: "easeOutQuad",
    });
  }, [post]);

  const loadPost = async () => {
    const data = await getDocumentById("posts", postId);
    setPost(data);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (!post) {
    return <div className="page-container">Carregando...</div>;
  }

  const images = post.coverImage
    ? [post.coverImage, ...(post.gallery || [])]
    : post.gallery || [];

  return (
    <div className="page-container post-page">
      <div className="post-layout">
        {/* CONTEÚDO PRINCIPAL */}
        <article ref={containerRef} className="post-article">
          {/* HEADER */}
          <header className="post-header">
            <h1 ref={titleRef} className="post-title">
              {post.title.split("").map((char, i) => (
                <span key={i}>{char === " " ? "\u00A0" : char}</span>
              ))}
            </h1>

            {post.subtitle && (
              <p className="post-subtitle">{post.subtitle}</p>
            )}

            <span className="post-meta">
              Publicado em {formatDate(post.createdAt)}
            </span>
          </header>

          {/* CAROUSEL */}
          {images.length > 0 && <GalleryCarousel images={images} />}

          {/* CONTEÚDO */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* SIDEBAR GLOBAL */}
        <SidebarContainer />
      </div>
    </div>
  );
};

export default PostIndividual;
