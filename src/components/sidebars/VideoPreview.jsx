import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/videopreview.css";

const VideoPreview = ({ video }) => {
  const [play, setPlay] = useState(false);

  if (!video?.youtubeId) return null;

  return (
    <div className="video-card">
      {play ? (
        <div className="video-iframe">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="video-thumb" onClick={() => setPlay(true)}>
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            loading="lazy"
          />
          <div className="play-button">▶</div>
        </div>
      )}

      {/* 🔗 LINK CORRETO */}
      <Link to={`/videos/${video.id}`} className="video-title">
        {video.title}
      </Link>

      {video.subtitle && (
        <p className="video-subtitle">{video.subtitle}</p>
      )}
    </div>
  );
};

export default VideoPreview;
