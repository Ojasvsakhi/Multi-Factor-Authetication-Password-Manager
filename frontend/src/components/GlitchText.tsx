import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence>
        {isGlitching && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 text-red-400"
            style={{ textShadow: '2px 2px #00ff00' }}
          >
            {text.split('').map(() => getRandomChar()).join('')}
          </motion.span>
        )}
      </AnimatePresence>
      <span className={isGlitching ? 'opacity-0' : ''}>
        {text}
      </span>
    </span>
  );
};