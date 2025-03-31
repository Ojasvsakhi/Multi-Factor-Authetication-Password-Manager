import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = '' }) => {
  const [glitch, setGlitch] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  return (
    <span className={`relative inline-block font-orbitron text-neon-blue ${className}`}>
      {/* Main Text */}
      <span className="relative z-10">{text}</span>
      
      {/* Glitch Layers */}
      {glitch && (
        <>
          {/* Red Offset */}
          <motion.span
            initial={{ x: -2, opacity: 0.8 }}
            animate={{ x: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 left-0 text-red-500 blur-sm z-0"
          >
            {text.split('').map(() => getRandomChar()).join('')}
          </motion.span>

          {/* Blue Offset */}
          <motion.span
            initial={{ x: 2, opacity: 0.8 }}
            animate={{ x: 0, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute top-0 left-0 text-blue-500 blur-sm z-0"
          >
            {text.split('').map(() => getRandomChar()).join('')}
          </motion.span>
        </>
      )}
    </span>
  );
};

// CSS Styles (Add this in your Tailwind or CSS file)
// .text-neon-blue { color: #00ffff; text-shadow: 0 0 12px #00ffff; }
// .glitch { animation: glitch-flicker 0.1s infinite alternate; }
// @keyframes glitch-flicker {
//   from { opacity: 1; transform: translateX(0px); }
//   to { opacity: 0.7; transform: translateX(1px); }
// }