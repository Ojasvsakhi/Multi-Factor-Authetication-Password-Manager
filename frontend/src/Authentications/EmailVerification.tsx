import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { authApi } from "../services/api";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const username = location.state?.username || "";
  const masterkey = location.state?.masterkey || "";
  const message = location.state?.message;
  const isAuthenticated = location.state?.isAuthenticated;
  const is_registration = location.state?.is_registration;

  useEffect(() => {
    if (!email) {
      setError("Email not provided.");
      navigate("/");
    }
  }, [email, navigate]);

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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError("");

    try {
      const otpString = otp.join("");
      const response = await authApi.verifyOTP(otpString);
      if (response.data.status === "success") {
        navigate("/captcha", {
          state: {
            email: email,
            username: username,
            masterkey: masterkey,
            isAuthenticated: isAuthenticated,
            is_registration: is_registration,
            message: response.data.message,
          },
        });
      } else {
        setError("Invalid OTP");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError("");
    try {
      await authApi.sendOTP(email);
      setError("OTP resent successfully");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
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
              boxShadow: [
                "0 0 20px #22d3ee",
                "0 0 10px #22d3ee",
                "0 0 20px #22d3ee",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <h1 className="text-3xl font-bold font-orbitron neon-text">
            VERIFY OTP
          </h1>
          <p className="mt-2 text-cyan-200/70">
            Enter the code sent to {email}
          </p>
          {message && <p className="mt-2 text-green-400 text-sm">{message}</p>}
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
                className="w-12 h-14 text-center text-2xl bg-gray-900/50 
                 border-2 border-cyan-500/50 rounded-lg 
                 text-cyan-400 font-['Share_Tech_Mono']
                 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50
                 focus:outline-none transition-all duration-300
                 shadow-[0_0_15px_rgba(34,211,238,0.1)]
                 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 placeholder-cyan-600/30"
                disabled={verifying || resending}
                inputMode="numeric"
                pattern="\d*"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm text-center ${
                error.toLowerCase().includes("success")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="cyber-button w-full"
            disabled={verifying || otp.some((digit) => !digit)}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOTP}
            disabled={resending}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
