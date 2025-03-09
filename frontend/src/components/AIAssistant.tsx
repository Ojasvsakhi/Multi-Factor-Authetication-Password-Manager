import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface Message {
  text: string;
  type: 'info' | 'warning' | 'success';
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const { playSound } = useSound();

  useEffect(() => {
    const notifications = [
      { text: 'Vault security scan complete. No threats detected.', type: 'success' as const },
      { text: 'Analyzing password patterns...', type: 'info' as const },
      { text: 'Weak password detected. Recommend update.', type: 'warning' as const },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < notifications.length) {
        playSound('click');
        setMessages(prev => [...prev, notifications[index]]);
        index++;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playSound]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 w-80 bg-gray-800/90 rounded-lg neon-border p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-orbitron">AI ASSISTANT</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-cyan-200/70 hover:text-cyan-200"
              aria-label="Close"
              title="Close">
              <X className="w-4 h-4" />
            </button>

          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-2 rounded text-sm ${
                    message.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    message.type === 'success' ? 'bg-green-500/20 text-green-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {message.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};