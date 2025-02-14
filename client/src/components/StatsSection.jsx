// src/components/StatsSection.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const stats = [
    { icon: 'fas fa-smile-beam', value: 1500, text: t('stats.clients') },
    { icon: 'fas fa-star', value: 18, text: t('stats.experience') },
    { icon: 'fas fa-lightbulb', value: 800, text: t('stats.projects') },
    { icon: 'fas fa-building', value: 2, text: t('stats.office') }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    const target = document.getElementById("stats-section");
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, []);

  return (
    <section id="stats-section" className="facts-section">
      <div className="container">
        <p className="section-subtitle">{t('statsSection.subtitle')}</p>
        <div className="wrapper-counter">
          {stats.map((stat, index) => (
            <motion.div key={index} className="container-counter" initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <i className={stat.icon}></i>
              <span className="text">{stat.text}</span>
              <motion.span className="num" initial={{ opacity: 0 }} animate={isVisible ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}>
                {isVisible ? <Counter from={0} to={stat.value} /> : '0'}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function Counter({ from, to }) {
  const [count, setCount] = useState(from);
  useEffect(() => {
    let start = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const current = Math.min(Math.floor((progress / duration) * (to - from) + from), to);
      setCount(current);
      if (progress < duration) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    return () => setCount(from);
  }, [from, to]);
  return <>{count}</>;
}

export default StatsSection;
