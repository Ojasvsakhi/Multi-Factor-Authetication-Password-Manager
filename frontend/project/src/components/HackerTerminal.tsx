import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Lock } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface HackerTerminalProps {
  onComplete: () => void;
}

const commands = [
  { text: '> Initializing secure connection...', delay: 500 },
  { text: '> Establishing quantum-encrypted channel...', delay: 1000 },
  { text: '> Bypassing neural firewalls...', delay: 1500 },
  { text: '> Accessing mainframe...', delay: 2000 },
  { text: '> Generating secure token...', delay: 2500 },
  { text: '> Decrypting vault access protocols...', delay: 3000 },
  { text: '> Access granted. Welcome, Commander.', delay: 3500 },
];

export const HackerTerminal: React.FC<HackerTerminalProps> = ({ onComplete }) => {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [showCommands, setShowCommands] = useState<boolean[]>(new Array(commands.length).fill(false));
  const { playSound } = useSound();

  useEffect(() => {
    const showNextCommand = () => {
      if (currentCommandIndex < commands.length) {
        playSound('click');
        setShowCommands(prev => {
          const next = [...prev];
          next[currentCommandIndex] = true;
          return next;
        });
        setCurrentCommandIndex(prev => prev + 1);
      } else {
        setTimeout(() => {
          playSound('success');
          onComplete();
        }, 1000);
      }
    };

    const timer = setTimeout(showNextCommand, commands[currentCommandIndex]?.delay || 0);
    return () => clearTimeout(timer);
  }, [currentCommandIndex, onComplete, playSound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-sm sm:text-base space-y-2"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Terminal className="w-5 h-5 text-cyan-400" />
        <span className="text-cyan-400">SECURE_TERMINAL_v2.0</span>
      </div>

      <AnimatePresence>
        {showCommands.map((show, index) => (
          show && (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-cyan-200/70"
            >
              {commands[index].text}
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-cyan-400"
      >
        _
      </motion.div>
    </motion.div>
  );
};