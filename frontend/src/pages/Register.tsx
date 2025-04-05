import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Key } from "lucide-react";
import { authApi } from "../services/api";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle email submission (send OTP)
  const handleSendOTP = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await authApi.sendOTP({email: email, isRegister: true}); // Mock API call
      if (response.data.success) {
        setSuccess("OTP sent successfully!"); // Set success message
        setTimeout(() => {
          setSuccess(""); // Clear success message after 3 seconds
          setStep(2); // Move to OTP input step
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setError("");
    try {
      const response = await authApi.verifyOTP(otp);
  
      if (response.data.status === "success") {
        // Print success message
        setSuccess(`${response.data.message}! Redirecting to ${response.data.next_step}...`);
        setTimeout(() => {
          navigate("/dashboard", {
            state: {
              is_registration: true,
              email: email,
              next_step: response.data.next_step
            }
          });
        }, 2000);
      } else {
        setError(response.data.error || "Invalid OTP.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-lg bg-gray-800/50 backdrop-blur-xl neon-border"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <Mail className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold font-orbitron neon-text">
            REGISTER
          </h1>
          <p className="mt-2 text-cyan-200/70">
            {step === 1 ? "Enter your email to receive OTP" : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Add success message display */}
        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}

        {step === 1 ? (
          // Step 1: Enter Email
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
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button onClick={handleSendOTP} className="cyber-button w-full">
              Send OTP
            </button>
          </div>
        ) : (
          // Step 2: Enter OTP
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
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button onClick={handleVerifyOTP} className="cyber-button w-full">
              Verify OTP
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
