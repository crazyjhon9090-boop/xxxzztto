// src/components/GalleryCarousel.jsx
import React, { useRef, useState, useEffect } from "react";
import { animate } from "animejs";
import "../styles/gallery-carousel.css";

const GalleryCarousel = ({ images }) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const startX = useRef(0);

  useEffect(() => {
    if (!trackRef.current) return;

    animate(trackRef.current, {
      translateX: `-${index * 100}%`,
      duration: 600,
      easing: "easeOutExpo",
    });
  }, [index]);

  const next = () => {
    if (index < images.length - 1) setIndex((i) => i + 1);
  };

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff < -50) next();
    if (diff > 50) prev();
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div className="carousel-slide" key={i}>
            <img src={img} alt={`Imagem ${i + 1}`} />
          </div>
        ))}
      </div>

      <button className="carousel-btn prev" onClick={prev}>
        ‹
      </button>
      <button className="carousel-btn next" onClick={next}>
        ›
      </button>
    </div>
  );
};

export default GalleryCarousel;
