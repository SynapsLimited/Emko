import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { icon: 'fas fa-smile-beam', value: 1500, text: 'Klientë të kënaqur' },
    { icon: 'fas fa-star', value: 18, text: 'Vite eksperiencë' },
    { icon: 'fas fa-lightbulb', value: 800, text: 'Projekte të realizuara' },
    { icon: 'fas fa-building', value: 2, text: 'Zyra qendrore' },
  ];

  // Observe when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("stats-section");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return (
    <section id="stats-section" className="facts-section">
      <div className="container">
        <p className="section-subtitle">Fakte rreth EMKO-s</p>
        <div className="wrapper-counter">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="container-counter"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <i className={stat.icon}></i>
              <span className="text">{stat.text}</span>
              <motion.span
                className="num"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
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
    const duration = 2000; // Duration of the count animation in milliseconds

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const current = Math.min(Math.floor((progress / duration) * (to - from) + from), to);
      setCount(current);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);

    // Cleanup function
    return () => setCount(from);
  }, [from, to]);

  return <>{count}</>;
}

export default StatsSection;
