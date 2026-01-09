import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarContainer from "../components/sidebars/SidebarContainer";
import { getDocumentById } from "../services/firestoreService";
import "../styles/video-individual.css";
import "../styles/layout-base.css";

const VideoIndividual = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideo();
  }, [videoId]);

  const loadVideo = async () => {
    setLoading(true);
    const data = await getDocumentById("videos", videoId);
    setVideo(data);
    setLoading(false);
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

  if (loading) {
    return <div className="page-container">Carregando vídeo...</div>;
  }

  if (!video) {
    return (
      <div className="page-container">
        <h2>Vídeo não encontrado</h2>
      </div>
    );
  }

  return (
    <div className="page-container video-page">
      <div className="video-layout">
        <article className="video-article">
          <header className="video-header">
            <h1 className="video-title"  >{video.title}</h1>

            {video.subtitle && (
              <p className="video-subtitle">{video.subtitle}</p>
            )}

            <span className="video-meta">
              Publicado em {formatDate(video.createdAt)}
            </span>
          </header>

          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {video.description && (
            <div className="video-description">
              {video.description}
            </div>
          )}
        </article>

        <SidebarContainer />
      </div>
    </div>
  );
};

export default VideoIndividual;
