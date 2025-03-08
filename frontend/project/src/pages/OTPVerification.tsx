import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ 
              boxShadow: ['0 0 20px #22d3ee', '0 0 10px #22d3ee', '0 0 20px #22d3ee']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold font-orbitron neon-text">VERIFY OTP</h1>
          <p className="mt-2 text-cyan-200/70">Enter the code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-orbitron cyber-input"
              />
            ))}
          </div>

          <button 
            type="submit"
            className="cyber-button w-full"
            disabled={otp.some(digit => !digit)}
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Resend Code
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;