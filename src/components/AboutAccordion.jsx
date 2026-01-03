import { useState } from 'react';
import '../styles/about-accordion.css';

const ITEMS = [
  {
    title: 'Quem Somos',
    content:
      'Somos uma plataforma dedicada à produção de conteúdo relevante, informativo e atual, conectando pessoas através da informação de qualidade.',
  },
  {
    title: 'Nossa Missão',
    content:
      'Levar informação clara, acessível e confiável, promovendo conhecimento, cidadania e desenvolvimento.',
  },
  {
    title: 'Nossa Visão',
    content:
      'Ser referência em conteúdo digital, unindo tecnologia, criatividade e responsabilidade social.',
  },
];

const AboutAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="about-accordion">
      {ITEMS.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${
            openIndex === index ? 'open' : ''
          }`}
        >
          <button
            className="accordion-header"
            onClick={() => toggle(index)}
          >
            {item.title}
            <span className="arrow">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>

          <div className="accordion-content">
            <p>{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutAccordion;
