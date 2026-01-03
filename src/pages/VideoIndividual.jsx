// src/pages/VideoIndividual.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarContainer from "../components/sidebars/SidebarContainer";
import { getDocumentById } from "../services/firestoreService";
import "../styles/video-individual.css";

const VideoIndividual = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    const data = await getDocumentById("videos", videoId);
    setVideo(data);
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

  if (!video) {
    return <div className="page-container">Carregando...</div>;
  }

  return (
    <div className="page-container video-page">
      <div className="video-layout">
        {/* CONTEÚDO */}
        <article className="video-article">
          <header className="video-header">
            <h1 className="video-title">{video.title}</h1>

            {video.subtitle && (
              <p className="video-subtitle">{video.subtitle}</p>
            )}

            <span className="video-meta">
              Publicado em {formatDate(video.createdAt)}
            </span>
          </header>

          {/* VIDEO */}
          <div
              className="video-wrapper"
              dangerouslySetInnerHTML={{ __html: video.iframe }}
            />

          {/* DESCRIÇÃO */}
          {video.description && (
            <div
              className="video-description"
              dangerouslySetInnerHTML={{ __html: video.description }}
            />
          )}
        </article>

        {/* SIDEBAR */}
        <SidebarContainer />
      </div>
    </div>
  );
};

export default VideoIndividual;
