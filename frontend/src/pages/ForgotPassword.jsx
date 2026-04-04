import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../config/env";
import { ClipLoader } from "react-spinners";
import {
  isStrongPassword,
  isValidEmail,
  isValidOtp,
} from "../utils/validation";
import { logger } from "../utils/logger";
import AuthShell from "../components/ui/AuthShell";
import BrandButton from "../components/ui/BrandButton";

function ForgotPassword() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email: email.trim().toLowerCase() },
        { withCredentials: true },
      );
      setError("");
      setStep(2);
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isValidOtp(otp)) {
      setError("Please enter a valid OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email: email.trim().toLowerCase(), otp: otp.trim() },
        { withCredentials: true },
      );
      setError("");
      setStep(3);
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isStrongPassword(newPassword)) {
      setError(
        "Password must be 8+ characters with uppercase, lowercase, and a number",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email: email.trim().toLowerCase(), newPassword },
        { withCredentials: true },
      );
      setError("");
      navigate("/signin");
    } catch (error) {
      logger.error("Reset password failed", error);
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const stepLabel =
    step === 1
      ? "Verify your email"
      : step === 2
        ? "Enter OTP"
        : "Set new password";

  const inputClass =
    "w-full border border-(--border-soft) rounded-(--radius-md) px-3 py-2.5 bg-white/90 focus:outline-none focus:ring-2 focus:ring-(--brand-2)/25 text-(--text-primary)";

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Securely recover your account in three quick steps."
      sideTitle="Password recovery without friction"
      sideDescription="Verify your email, confirm OTP, and set a strong new password while your session stays protected."
    >
      <div className="space-y-5">
        <button
          className="inline-flex items-center gap-1 text-sm font-medium text-(--text-secondary) hover:text-(--brand-2) transition-colors cursor-pointer"
          type="button"
          onClick={() => navigate("/signin")}
        >
          <IoIosArrowRoundBack size={24} /> Back to sign in
        </button>

        <div className="flex items-center justify-between rounded-md border border-(--border-soft) bg-(--bg-subtle) px-3 py-2 text-xs sm:text-sm">
          <span className="font-semibold text-(--text-secondary)">
            Step {step} of 3
          </span>
          <span className="text-(--text-muted)">{stepLabel}</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-(--text-secondary) font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <BrandButton
              className="w-full"
              onClick={handleSendOtp}
              disabled={loading}
              type="button"
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Send OTP"}
            </BrandButton>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-(--text-secondary) font-medium mb-1"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                className={inputClass}
                placeholder="Enter 6-digit OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                maxLength={6}
                required
              />
            </div>
            <BrandButton
              className="w-full"
              onClick={handleVerifyOtp}
              disabled={loading}
              type="button"
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Verify OTP"}
            </BrandButton>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-(--text-secondary) font-medium mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={inputClass}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-(--text-secondary) font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={inputClass}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
            <BrandButton
              className="w-full"
              onClick={handleResetPassword}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                "Reset Password"
              )}
            </BrandButton>
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">*{error}</p>}
      </div>
    </AuthShell>
  );
}
export default ForgotPassword;
