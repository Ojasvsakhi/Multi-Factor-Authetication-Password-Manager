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
    const notifications: Message[] = [
      { text: 'Vault security scan complete. No threats detected.', type: 'success' },
      { text: 'Analyzing password patterns...', type: 'info' },
      { text: 'Weak password detected. Recommend update.', type: 'warning' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < notifications.length) {
        playSound('click');
        setMessages(prev => [...prev, notifications[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [playSound]);

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'info':
      default:
        return 'bg-cyan-500/20 text-cyan-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 w-[300px] bg-gray-800/90 rounded-lg neon-border p-4 overflow-hidden backdrop-blur-sm z-50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-orbitron">AI ASSISTANT</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-cyan-200/70 hover:text-cyan-200 transition-colors"
              aria-label="Close"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {messages.map((message, index) => (
                message && message.text && message.type ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded text-sm ${getMessageStyle(message.type)}`}
                  >
                    {message.text}
                  </motion.div>
                ) : null
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};