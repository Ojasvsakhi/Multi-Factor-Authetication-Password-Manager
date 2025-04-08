import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail } from "lucide-react";
import { MatrixRain } from "../components/MatrixRain";
import { HackerTerminal } from "../components/HackerTerminal";
import { authApi } from "../services/api";
const Email: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isHacking, setIsHacking] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Add this state at the top with other states

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHacking(true);
    setError(""); // Clear any previous errors

    try {
      const response = await authApi.sendOTP({email: email, isRegister: true});
      if (response.data.message) {
        navigate("/verify", {
          state: {
            email,
            message: response.data.message,
          },
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP");
      setIsHacking(false);
    }
  };

  const handleHackComplete = () => {
    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <MatrixRain />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border relative z-10"
      >
        {!isHacking ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4"
              >
                <Shield className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <h1 className="text-3xl font-bold font-orbitron neon-text">
                SECURE ACCESS
              </h1>
              <p className="mt-2 text-cyan-200/70">
                Enter your credentials to begin hack sequence
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="cyber-input w-full pl-12"
                  required
                />
              </div>

              <button type="submit" className="cyber-button w-full">
                Initialize Hack Sequence
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-cyan-200/50">
                Protected by Quantum Encryption™
              </p>
            </div>
          </>
        ) : (
          <HackerTerminal onComplete={handleHackComplete} />
        )}
      </motion.div>
    </div>
  );
};

export default Email;