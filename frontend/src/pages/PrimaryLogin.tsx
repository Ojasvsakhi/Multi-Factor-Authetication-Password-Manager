import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { authApi } from "../services/api";

const PrimaryLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [masterkey, setMasterkey] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.verifyUser({ username, masterkey });
      if (response.data.exists) {
        // User exists, navigate to the current login page
        navigate("/otp-login");
      } else {
        // User does not exist, navigate to email OTP registration page
        navigate("/register");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold font-orbitron neon-text">
            MASTER LOGIN
          </h1>
          <p className="mt-2 text-cyan-200/70">Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="cyber-input w-full pl-12"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
            <input
              type="password"
              value={masterkey}
              onChange={(e) => setMasterkey(e.target.value)}
              placeholder="Masterkey"
              className="cyber-input w-full pl-12"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="cyber-button w-full">
            Authenticate
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-cyan-200/50">Secure Access</p>
          <p className="mt-4 text-sm text-cyan-200">
            Don't have an account? 
            <button 
              className="text-cyan-400 cursor-pointer hover:underline" 
              onClick={handleRegisterClick}
            > Register</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrimaryLogin;
