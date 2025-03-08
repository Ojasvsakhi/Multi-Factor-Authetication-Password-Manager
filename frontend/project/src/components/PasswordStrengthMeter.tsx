import React from 'react';
import zxcvbn from 'zxcvbn';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const result = zxcvbn(password);
  const score = result.score; // 0-4

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-cyan-400';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'N/A';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-cyan-200/70">Password Strength</span>
        </div>
        <span className={`text-sm ${getStrengthColor(score).replace('bg-', 'text-')}`}>
          {getStrengthText(score)}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score + 1) * 20}%` }}
          className={`h-full ${getStrengthColor(score)}`}
          transition={{ duration: 0.3 }}
        />
      </div>
      {result.feedback.warning && (
        <p className="text-xs text-yellow-400 mt-1">{result.feedback.warning}</p>
      )}
      {result.feedback.suggestions.length > 0 && (
        <ul className="text-xs text-cyan-200/50 mt-1 list-disc list-inside">
          {result.feedback.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};