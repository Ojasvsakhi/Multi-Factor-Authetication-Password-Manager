import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Lock, RefreshCw, AlertTriangle, Download, Upload, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';

const EncryptionSettings: React.FC = () => {
  const [backupFrequency, setBackupFrequency] = useState('weekly');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [encryptionStrength, setEncryptionStrength] = useState('3');

  const handleStrengthChange = (value: string) => {
    setEncryptionStrength(value);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <Link to="/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold font-orbitron neon-text">ENCRYPTION SETTINGS</h1>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-orbitron neon-text">Encryption Key</h2>
                <p className="text-cyan-200/70">Manage your master encryption key</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="cyber-button w-full">
                <RefreshCw className="w-5 h-5 mr-2" />
                Rotate Encryption Key
              </button>
              <div className="flex items-center justify-between text-sm">
                <span className="text-cyan-200/50">Last rotated: 15 days ago</span>
                <span className="text-cyan-400">Next rotation in 15 days</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-orbitron neon-text">Security Level</h2>
                <p className="text-cyan-200/70">Configure encryption strength</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-cyan-200/70 mb-2">
                  Encryption Strength
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={encryptionStrength}
                  onChange={(e) => handleStrengthChange(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className={`text-cyan-200/50 ${encryptionStrength === '1' && 'text-cyan-400'}`}>Standard</span>
                  <span className={`text-cyan-200/50 ${encryptionStrength === '2' && 'text-cyan-400'}`}>Enhanced</span>
                  <span className={`text-cyan-200/50 ${encryptionStrength === '3' && 'text-cyan-400'}`}>Maximum</span>
                </div>
              </div>
              {encryptionStrength === '3' && (
                <div className="flex items-center p-3 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  <p className="text-sm text-yellow-500">Maximum strength may impact performance</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-orbitron neon-text">Auto-Lock</h2>
                <p className="text-cyan-200/70">Session security settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-cyan-200/70">Auto-lock after inactivity</label>
                <select 
                  className="cyber-input bg-gray-800/50"
                  defaultValue="15"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-cyan-200/70">Lock on browser close</label>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificationsEnabled ? 'bg-cyan-500/20' : 'bg-gray-700'
                  }`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-cyan-400 top-1 transition-transform ${
                      notificationsEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-orbitron neon-text">Additional Security</h2>
                <p className="text-cyan-200/70">Extra security measures</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-cyan-200/70 block">Biometric Authentication</label>
                  <span className="text-xs text-cyan-200/50">Use fingerprint or Face ID</span>
                </div>
                <button
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    biometricEnabled ? 'bg-cyan-500/20' : 'bg-gray-700'
                  }`}
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                >
                  <div
                    className={`absolute w-4 h-4 rounded-full bg-cyan-400 top-1 transition-transform ${
                      biometricEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="text-cyan-200/70 block mb-2">Backup Frequency</label>
                <select
                  className="cyber-input w-full bg-gray-800/50"
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="cyber-button">
                  <Download className="w-4 h-4 mr-2" />
                  Export Keys
                </button>
                <button className="cyber-button">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Keys
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EncryptionSettings;