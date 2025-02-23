import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from "@mui/material";

const OtpFlow = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (step === "otp" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/send-otp",
        { email },
        { withCredentials: true }
      );
      setSuccess("OTP resent successfully");
      setTimeLeft(30); // Reset timer to 5 minutes
      setCanResend(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/send-otp",
        { email },
        { withCredentials: true }
      );
      setStep("otp");
      setSuccess("OTP sent successfully");
      setTimeLeft(300); // Initialize timer
      setCanResend(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        { otp },
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setSuccess(response.data.message);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        width: "200vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            width: "100%",
            maxWidth: "1000px",
            minHeight: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {success && (
            <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          {step === "email" ? (
            <form onSubmit={handleSendOtp} style={{ width: "100%" }}>
              <Typography variant="h5" gutterBottom align="center">
                Enter Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ width: "100%" }}>
              <Typography variant="h5" gutterBottom align="center">
                Enter OTP
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 1 }}>
                OTP has been sent to {email}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
                Time remaining: {formatTime(timeLeft)}
              </Typography>
              <TextField
                fullWidth
                type="text"
                label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                required
                disabled={loading}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  sx={{
                    textDecoration: "none",
                    cursor: canResend ? "pointer" : "default",
                    color: canResend ? "primary.main" : "text.disabled",
                  }}
                >
                  {canResend ? "Resend OTP" : `Wait ${formatTime(timeLeft)} before resending`}
                </Link>
              </Box>
            </form>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default OtpFlow;