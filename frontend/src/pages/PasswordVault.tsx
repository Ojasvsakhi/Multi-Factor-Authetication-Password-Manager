import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Copy, Edit, Trash2, Plus, Search, Filter, Eye, EyeOff, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PasswordVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const passwords = [
    { 
      id: 1, 
      name: 'Gmail', 
      username: 'user@example.com', 
      password: '********', 
      category: 'email',
      strength: 'strong',
      lastUpdated: '2024-03-15' 
    },
    { 
      id: 2, 
      name: 'GitHub', 
      username: 'cyberdeveloper', 
      password: '********', 
      category: 'development',
      strength: 'medium',
      lastUpdated: '2024-03-14' 
    },
    { 
      id: 3, 
      name: 'AWS', 
      username: 'admin@company.com', 
      password: '********', 
      category: 'cloud',
      strength: 'strong',
      lastUpdated: '2024-03-13' 
    },
  ];

  const categories = ['all', 'email', 'development', 'cloud', 'social', 'finance'];

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'weak': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold font-orbitron neon-text">PASSWORD VAULT</h1>
          </div>
          <button className="cyber-button w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="text"
                placeholder="Search passwords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-input w-full pl-12"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <select
                className="cyber-input pl-12 pr-8 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <AnimatePresence>
            {filteredPasswords.map((password) => (
              <motion.div
                key={password.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 sm:p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Key className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-orbitron neon-text truncate">{password.name}</h2>
                      <p className="text-cyan-200/70 truncate">{password.username}</p>
                      <div className="flex items-center mt-1">
                        <Shield className={`w-4 h-4 mr-1 ${getStrengthColor(password.strength)}`} />
                        <span className={`text-xs ${getStrengthColor(password.strength)}`}>
                          {password.strength.charAt(0).toUpperCase() + password.strength.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2 text-sm text-cyan-200/50">
                      <span className="hidden sm:inline">Updated:</span>
                      <span>{password.lastUpdated}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors group relative"
                        onClick={() => setShowPassword(showPassword === password.id ? null : password.id)}
                      >
                        {showPassword === password.id ? (
                          <EyeOff className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-cyan-400" />
                        )}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-cyan-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {showPassword === password.id ? 'Hide' : 'Show'}
                        </span>
                      </button>
                      <button className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors group relative">
                        <Copy className="w-5 h-5 text-cyan-400" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-cyan-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Copy
                        </span>
                      </button>
                      <button className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors group relative">
                        <Edit className="w-5 h-5 text-cyan-400" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-cyan-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group relative">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-red-400 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                {showPassword === password.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-cyan-500/20"
                  >
                    <p className="font-mono text-cyan-400">●●●●●●●●</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordVault;