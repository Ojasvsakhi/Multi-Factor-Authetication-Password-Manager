import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Key } from "lucide-react";
import { authApi } from "../services/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle email submission (send OTP)
  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await authApi.sendOTP({ email: email, isRegister: true });
      if (response.data.success) {
        setSuccess("OTP sent successfully!");
        setTimeout(() => {
          setSuccess("");
          setStep(2);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await authApi.verifyOTP(otp);
      if (response.data.status === "success") {
        setSuccess(`${response.data.message}! Redirecting to ${response.data.next_step}...`);
        setTimeout(() => {
          navigate("/Username_masterkey", {
            state: {
              is_registration: true,
              is_authenticated: true,
              email: email,
              next_step: response.data.next_step,
            },
          });
        }, 2000);
      } else {
        setError(response.data.error || "Invalid OTP.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
      >
        {/* Heading with Orbitron font and glow effect */}
        <h2 className="text-3xl font-orbitron text-cyan-300 mb-6 text-center uppercase tracking-widest glow-text">
          Register
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="cyber-input w-full pl-12"
                required
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleSendOTP}
              className="cyber-button w-full"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="cyber-input w-full pl-12"
                required
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleVerifyOTP}
              className="cyber-button w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-cyan-200/50">Secure Registration Process</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
