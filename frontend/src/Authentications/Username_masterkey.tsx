import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, RefreshCw, Eye, EyeOff } from "lucide-react";
import { authApi } from "../services/api";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/;
const MASTERKEY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const generateMasterKey = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "@$!%*?&";

  let masterkey = "";
  masterkey += lowercase[Math.floor(Math.random() * lowercase.length)];
  masterkey += uppercase[Math.floor(Math.random() * uppercase.length)];
  masterkey += numbers[Math.floor(Math.random() * numbers.length)];
  masterkey += symbols[Math.floor(Math.random() * symbols.length)];

  const allChars = lowercase + uppercase + numbers + symbols;
  while (masterkey.length < 12) {
    masterkey += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return masterkey.split("").sort(() => Math.random() - 0.5).join("");
};

const Username_masterkey: React.FC = () => {
  const [username, setUsername] = useState("");
  const [masterkey, setMasterkey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const is_registration = location.state?.is_registration || false;
  const is_authenticated = location.state?.is_authenticated || false;
  const [usernameError, setUsernameError] = useState("");
  const [masterkeyError, setMasterkeyError] = useState("");
  const email = location.state?.email || "";
  const validateUsername = (value: string): boolean => {
    if (!USERNAME_REGEX.test(value)) {
      setUsernameError(
        "Username must be 4-20 characters long and can only contain letters, numbers, and underscores"
      );
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateMasterkey = (value: string): boolean => {
    if (!MASTERKEY_REGEX.test(value)) {
      setMasterkeyError(
        "Master key must be at least 8 characters long and contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      );
      return false;
    }
    setMasterkeyError("");
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value) validateUsername(value);
  };

  const handleMasterkeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMasterkey(value);
    if (value) validateMasterkey(value);
  };

  const handleSuggestMasterkey = () => {
    const suggested = generateMasterKey();
    setMasterkey(suggested);
    validateMasterkey(suggested);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const isUsernameValid = validateUsername(username);
    const isMasterkeyValid = validateMasterkey(masterkey);

    if (!isUsernameValid || !isMasterkeyValid) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const response = await authApi.verifyUser({
        username,
        masterkey,
        is_registration,
      });

      if (is_registration) {
        navigate("/captcha", {
          state: { is_registration: is_registration, username: username, masterkey: masterkey,email: email, message: "Proceed to register puzzle" },
        });
      } else if (response.data.status === "success") {
        navigate("/captcha", {
          state: {
            email: email,
            username: username,
            masterkey: masterkey,
            is_registration: is_registration,
            is_authenticated:is_authenticated,
            message: "Proceed to pattern verification" // Adding message since ImageGridCaptcha expects it
          },});
      } else {
        setError("Invalid username or master key. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Authentication failed. Please verify your credentials.");
      } else {
        setError(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
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
            {is_registration
              ? "CREATE MASTER KEY"
              : is_authenticated
              ? "VERIFY ACCESS"
              : "MASTER LOGIN"}
          </h1>
          <p className="mt-2 text-cyan-200/70">
            {is_registration
              ? "Set your username and master key"
              : is_authenticated
              ? "Verify your credentials"
              : "Enter your username and master key"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              className={`cyber-input w-full pl-12 ${
                usernameError ? "border-red-500" : ""
              }`}
              required
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/50" />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={masterkey}
                  onChange={handleMasterkeyChange}
                  placeholder="Master Key"
                  className={`cyber-input w-full pl-12 pr-10 ${
                    masterkeyError ? "border-red-500" : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500/50 hover:text-cyan-400 focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {is_registration && (
                <button
                  type="button"
                  onClick={handleSuggestMasterkey}
                  className="cyber-button-small flex items-center gap-2"
                  title="Generate Strong Master Key"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </button>
              )}
            </div>
            {masterkeyError && (
              <p className="text-red-500 text-xs mt-1">{masterkeyError}</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-md p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="cyber-button w-full"
            disabled={loading}
          >
            {loading
              ? "Authenticating..."
              : is_registration
              ? "Continue"
              : is_authenticated
              ? "Verify Access"
              : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Username_masterkey;
