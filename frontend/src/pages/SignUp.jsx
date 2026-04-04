import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { serverUrl } from "../config/env";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";
import {
  isStrongPassword,
  isValidEmail,
  isValidMobileNumber,
} from "../utils/validation";
import { logger } from "../utils/logger";
import AuthShell from "../components/ui/AuthShell";
import BrandButton from "../components/ui/BrandButton";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const inputClassName =
    "w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-white/90 px-3.5 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--brand-1)] focus:ring-2 focus:ring-[color:var(--brand-soft)]";

  const handleSignUp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();
    const normalizedMobile = mobileNumber.trim();

    if (normalizedName.length < 2) {
      setError("Full name must be at least 2 characters");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!isValidMobileNumber(normalizedMobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!isStrongPassword(password)) {
      setError(
        "Password must be 8+ characters with uppercase, lowercase, and a number",
      );
      return;
    }
    if (!["user", "owner", "deliveryBoy"].includes(role)) {
      setError("Please select a valid role");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName: normalizedName,
          email: normalizedEmail,
          mobileNumber: normalizedMobile,
          password,
          role,
        },
        { withCredentials: true },
      );
      dispatch(setUserData({ user: result.data }));
      setError("");
      setLoading(false);
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isValidMobileNumber(mobileNumber)) {
      return setError(
        "Please enter a valid 10-digit mobile number before Google sign up",
      );
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          mobileNumber,
          role,
        },
        { withCredentials: true },
      );
      dispatch(setUserData({ user: data }));
    } catch (error) {
      logger.error("Google sign-up failed", error);
      setError(error?.response?.data?.message || "Google sign-up failed");
    }
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join Vingo and unlock smarter discovery, live delivery tracking, and one-tap reorders."
      sideTitle="Launch your food routine in minutes."
      sideDescription="Whether you are ordering, managing a shop, or handling deliveries, your workspace adapts instantly."
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-(--text-secondary) mb-1.5"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className={inputClassName}
            placeholder="Alex Johnson"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-(--text-secondary) mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-(--text-secondary) mb-1.5"
          >
            Mobile number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            className={inputClassName}
            placeholder="10-digit phone number"
            onChange={(e) => setMobileNumber(e.target.value)}
            value={mobileNumber}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-(--text-secondary) mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={inputClassName}
              placeholder="At least 8 chars, 1 uppercase, 1 number"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3.5 text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        <div>
          <p className="block text-sm font-medium text-(--text-secondary) mb-2">
            Role
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                className={`rounded-md px-3 py-2 text-sm font-semibold capitalize border transition-all duration-200 cursor-pointer ${
                  role === r
                    ? "brand-gradient-bg text-white border-white/20 shadow-(--shadow-sm)"
                    : "bg-white/85 text-(--text-secondary) border-(--border-soft) hover:border-(--brand-1)"
                }`}
                onClick={() => setRole(r)}
              >
                {r === "deliveryBoy" ? "Delivery" : r}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <BrandButton
          className="w-full mt-2"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={18} color="white" /> : "Create Account"}
        </BrandButton>

        <BrandButton
          variant="ghost"
          className="w-full"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </BrandButton>

        <p className="text-sm text-center text-(--text-muted) pt-1">
          Already have an account?{" "}
          <button
            type="button"
            className="font-semibold text-(--brand-2) hover:opacity-80 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  );
}

export default SignUp;
