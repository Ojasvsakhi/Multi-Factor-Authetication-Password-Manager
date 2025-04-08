import React, { useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const is_authenticated = location.state?.is_authenticated || false;
  const is_registration = location.state?.is_registration||false;
  const username = location.state?.username;
  const masterkey = location.state?.masterkey;
  useEffect(() => {
    if (!username || !masterkey) {
      navigate('/login', { replace: true });
    }
  }, [username, masterkey, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHacking(true);
    setError(""); // Clear any previous errors

    try {
      const response = await authApi.sendOTP({email: email, isRegister:is_registration});
      if (response.data.success) {
        navigate("/verify", {
          state: {
            email,
            is_registration,
            is_authenticated,
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
              <h1 className="text-2xl font-bold font-orbitron neon-text">
                EMAIL AUTHENTICATION 
              </h1>
              <p className="mt-2 text-cyan-200/70">
                Enter your registered email to proceed
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
                SEND OTP
              </button>
            </form>
          </>
        ) : (
          <HackerTerminal onComplete={handleHackComplete} />
        )}
      </motion.div>
    </div>
  );
};
  
export default Email;