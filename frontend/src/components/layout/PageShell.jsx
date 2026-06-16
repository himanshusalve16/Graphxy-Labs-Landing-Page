import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PageShell({ children }) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Scroll reveal intersection observer bindings
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [children]);

  // Page entry transitions definitions
  const pageVariants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -12,
      transition: {
        duration: 0.25,
        ease: [0.7, 0, 0.84, 0],
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
