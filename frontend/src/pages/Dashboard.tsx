import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Key, Shield, Settings, Lock, AlertTriangle, Activity, Clock, Users, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNavigationProtection } from '../hooks/usenavigateprotection';
import { authApi } from '../services/api';
const Dashboard: React.FC = () => {
  useNavigationProtection();
  const navigate = useNavigate();
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [backupInProgress, setBackupInProgress] = useState(false);

  const stats = [
    { icon: Key, label: 'Total Passwords', value: '24', change: '+3 this week', onClick: () => navigate('/vault') },
    { icon: Shield, label: 'Security Score', value: '92%', change: '+5% from last month', onClick: () => navigate('/settings') },
    { icon: Activity, label: 'Active Sessions', value: '2', change: 'Desktop, Mobile', onClick: handleManageSessions },
    { icon: Clock, label: 'Last Backup', value: '2h ago', change: 'Next backup in 22h', onClick: handleBackup },
  ];

  const recentActivities = [
    { type: 'password_added', service: 'Netflix', time: '2 hours ago' },
    { type: 'password_changed', service: 'GitHub', time: '5 hours ago' },
    { type: 'security_alert', service: 'Gmail', time: '1 day ago' },
    { type: 'backup_completed', service: 'System', time: '2 days ago' },
  ];

  const securityAlerts = [
    { 
      level: 'high', 
      message: '3 passwords are weak and need updating', 
      action: 'Review Now',
      onClick: () => navigate('/vault')
    },
    { 
      level: 'medium', 
      message: 'Backup is due in 2 days', 
      action: 'Backup Now',
      onClick: handleBackup
    },
    { 
      level: 'low', 
      message: 'New login detected from United States', 
      action: 'View Details',
      onClick: handleViewLoginDetails
    },
  ];

  function handleManageSessions() {
    navigate('/settings#sessions');
  }

  function handleBackup() {
    setBackupInProgress(true);
    // Simulate backup process
    setTimeout(() => {
      setBackupInProgress(false);
    }, 2000);
  }
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await authApi.logout();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout failed:', error);
        navigate('/', { replace: true });
      }
    }
  };
  function handleViewLoginDetails() {
    // Implement login details modal or navigation
    navigate('/settings#security');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/vault?search=${encodeURIComponent(searchQuery)}`);
    }
  }
  
  return (
    
    <div className="min-h-screen p-6">
      <button 
        onClick={handleLogout}
        className="cyber-button"
      >
        Logout
      </button>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold font-orbitron neon-text">COMMAND CENTER</h1>
            <p className="text-cyan-200/70 mt-2">Welcome back, Commander</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link 
              to="/settings" 
              className="cyber-button flex-1 sm:flex-initial justify-center"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setShowShareModal(true)}
              className="cyber-button flex-1 sm:flex-initial justify-center"
              title="Share Access"
            >
              <Users className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Share Access</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={stat.onClick}
              className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border group hover:bg-gray-800/70 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-cyan-200/70">{stat.label}</p>
                  <p className="text-2xl font-orbitron neon-text">{stat.value}</p>
                  <p className="text-xs text-cyan-200/50 mt-1">{stat.change}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="text"
                placeholder="Quick search passwords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cyber-input w-full pl-12"
              />
            </form>
          </div>
          <div className="flex gap-4">
            <Link to="/vault" className="cyber-button flex-1 justify-center">
              <Lock className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Password Vault</span>
            </Link>
            <button 
              onClick={() => setShowNewPasswordModal(true)}
              className="cyber-button bg-cyan-500/30 hover:bg-cyan-500/40 px-4"
              title="Add New Password"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-orbitron neon-text">Security Alerts</h2>
            {securityAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={alert.onClick}
                className={`p-4 rounded-lg backdrop-blur-xl flex items-center justify-between cursor-pointer ${
                  alert.level === 'high' ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30' :
                  alert.level === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30' :
                  'bg-gray-500/20 border-gray-500/50 hover:bg-gray-500/30'
                } border transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.level === 'high' ? 'text-red-400' :
                    alert.level === 'medium' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`} />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert.onClick();
                  }}
                  className="cyber-button text-sm py-1 px-3"
                >
                  {alert.action}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-orbitron neon-text">Recent Activity</h2>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-4 neon-border">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-cyan-500/20 last:border-0 hover:bg-gray-800/30 rounded-lg px-3 cursor-pointer transition-colors"
                  onClick={() => navigate(`/vault?service=${activity.service}`)}
                >
                  <div>
                    <p className="text-sm text-cyan-200">{activity.service}</p>
                    <p className="text-xs text-cyan-200/50">{activity.time}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    activity.type === 'security_alert' ? 'bg-red-500/20 text-red-400' :
                    activity.type === 'password_changed' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {activity.type.replace('_', ' ')}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Password Modal */}
      <AnimatePresence>
        {showNewPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 rounded-lg p-6 w-full max-w-md neon-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-orbitron neon-text">Add New Password</h2>
                <button
                  onClick={() => setShowNewPasswordModal(false)}
                  className="text-cyan-200/70 hover:text-cyan-200 p-2"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                setShowNewPasswordModal(false);
                navigate('/vault');
              }}>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Service Name</label>
                  <input type="text" className="cyber-input w-full" placeholder="e.g., Gmail" required />
                </div>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Username/Email</label>
                  <input type="text" className="cyber-input w-full" placeholder="username@example.com" required />
                </div>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Password</label>
                  <input type="password" className="cyber-input w-full" placeholder="Enter password" required />
                </div>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Category</label>
                  <select className="cyber-input w-full" required>
                    <option value="">Select a category</option>
                    <option value="email">Email</option>
                    <option value="social">Social Media</option>
                    <option value="finance">Finance</option>
                    <option value="work">Work</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewPasswordModal(false)}
                    className="cyber-button bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cyber-button">
                    Save Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Access Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 rounded-lg p-6 w-full max-w-md neon-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-orbitron neon-text">Share Access</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-cyan-200/70 hover:text-cyan-200 p-2"
                >
                  ✕
                </button>
              </div>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                setShowShareModal(false);
              }}>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Email Address</label>
                  <input type="email" className="cyber-input w-full" placeholder="colleague@example.com" required />
                </div>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Access Level</label>
                  <select className="cyber-input w-full" required>
                    <option value="">Select access level</option>
                    <option value="read">View Only</option>
                    <option value="write">View & Edit</option>
                    <option value="admin">Full Access</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-cyan-200/70 mb-2">Expiry</label>
                  <select className="cyber-input w-full" required>
                    <option value="">Select duration</option>
                    <option value="1">24 Hours</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="0">No Expiry</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="cyber-button bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cyber-button">
                    Share Access
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backup Progress Modal */}
      <AnimatePresence>
        {backupInProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800/90 rounded-lg p-6 neon-border text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 mx-auto mb-4"
              >
                <RefreshCw className="w-full h-full text-cyan-400" />
              </motion.div>
              <p className="text-cyan-200">Backup in progress...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;