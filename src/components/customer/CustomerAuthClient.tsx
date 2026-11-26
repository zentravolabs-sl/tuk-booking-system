"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  sendCustomerLoginOtpAction,
  sendCustomerRegistrationOtpAction,
  verifyCustomerRegistrationOtpAction,
  resendCustomerRegistrationOtpAction
} from "@/app/actions/customer-auth-actions";
import {
  Mail,
  User,
  Phone,
  Globe,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Compass,
  ArrowLeft
} from "lucide-react";

export function CustomerAuthClient({
  initialMode = "login"
}: {
  initialMode?: "login" | "register";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Login State (Email + OTP, No Password)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration State (Email + OTP, No Password)
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // OTP Verification Step State
  const [otpStep, setOtpStep] = useState(false);
  const [activeOtpEmail, setActiveOtpEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = loginEmail.trim().toLowerCase();
    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await sendCustomerLoginOtpAction(cleanedEmail);
      if (!res.success) {
        toast.error(res.error || "Could not send login OTP to your email.");
      } else {
        setActiveOtpEmail(cleanedEmail);
        setOtpStep(true);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        toast.success(`A 6-digit login OTP has been sent to ${cleanedEmail}`);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      }
    } catch {
      toast.error("Unable to send login OTP right now. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedEmail = regEmail.trim().toLowerCase();
    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setRegLoading(true);
    try {
      const res = await sendCustomerRegistrationOtpAction({
        fullName,
        email: cleanedEmail,
        phone,
        country
      });

      if (!res.success) {
        toast.error(res.error || "Could not send verification OTP.");
      } else {
        setActiveOtpEmail(cleanedEmail);
        setOtpStep(true);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        toast.success(
          `A 6-digit OTP verification code has been sent to ${cleanedEmail}`
        );
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      }
    } catch {
      toast.error("Unable to process registration right now.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    // Handle pasting full 6-digit OTP
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const updated = [...otpDigits];
      chars.forEach((ch, idx) => {
        if (index + idx < 6) {
          updated[index + idx] = ch;
        }
      });
      setOtpDigits(updated);
      const nextFocusIndex = Math.min(5, index + chars.length);
      otpRefs.current[nextFocusIndex]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const updated = ["", "", "", "", "", ""];
    pasted.split("").forEach((ch, idx) => {
      updated[idx] = ch;
    });
    setOtpDigits(updated);
    const focusIdx = Math.min(5, pasted.length);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP sent to your email.");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await verifyCustomerRegistrationOtpAction(
        activeOtpEmail,
        otpCode
      );
      if (!res.success) {
        toast.error(res.error || "Invalid OTP code.");
      } else {
        toast.success(
          `Ayubowan, ${res.customer?.fullName || "Traveler"}! Welcome to your Customer Dashboard.`
        );
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Unable to verify OTP right now.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) return;
    setResendingOtp(true);
    try {
      const res = await resendCustomerRegistrationOtpAction(activeOtpEmail);
      if (!res.success) {
        toast.error(res.error || "Unable to resend OTP.");
      } else {
        setOtpDigits(["", "", "", "", "", ""]);
        setResendCooldown(60);
        toast.success("A new 6-digit OTP code has been sent to your email.");
        otpRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Unable to resend OTP right now.");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-premium border border-brand-forest/15 overflow-hidden">
        {/* Top Brand Banner */}
        <div className="bg-[#0B3024] px-6 sm:px-8 py-6 text-center text-white">
          <div className="w-12 h-12 rounded-2xl bg-[#164B35] border border-[#E8B44C]/40 text-[#E8B44C] flex items-center justify-center mx-auto mb-3 shadow-md">
            <Compass className="w-6 h-6" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E8B44C] bg-white/10 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Traveler Portal</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
            {otpStep
              ? "Enter Email OTP to Sign In"
              : mode === "login"
              ? "Customer Sign In with OTP"
              : "Create Customer Account"}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-sm mx-auto">
            {otpStep
              ? "Enter the 6-digit verification code sent to your email address to log in."
              : mode === "login"
              ? "Enter your email address to receive a 6-digit one-time login code — no password needed."
              : "Register with your email address. We will send a 6-digit OTP to your email to log you in."}
          </p>
        </div>

        {/* Mode Switch Tabs (hidden during OTP step) */}
        {!otpStep && (
          <div className="grid grid-cols-2 border-b border-brand-forest/10 bg-brand-cream/50 p-1.5 m-5 mb-0 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === "login"
                  ? "bg-[#164B35] text-white shadow-sm"
                  : "text-brand-dark/70 hover:text-brand-dark"
              }`}
            >
              Sign In with Email OTP
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                mode === "register"
                  ? "bg-[#164B35] text-white shadow-sm"
                  : "text-brand-dark/70 hover:text-brand-dark"
              }`}
            >
              New Customer Details
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* STEP 2: OTP VALIDATION FOR LOGIN OR REGISTRATION */}
          {otpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="bg-[#FFF8ED] border border-[#E8B44C] rounded-2xl p-4 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#164B35]">
                  <Mail className="w-4 h-4 text-[#E8B44C]" />
                  <span>6-Digit OTP Sent to Your Email</span>
                </div>
                <p className="font-mono text-sm font-bold text-[#0B3024] break-all">
                  {activeOtpEmail}
                </p>
                <p className="text-[11px] text-gray-600">
                  Please check your inbox (and spam/promotions folder) for the 6-digit login code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest text-center mb-3">
                  Enter 6-Digit Email OTP *
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black text-[#0B3024] bg-brand-cream/70 border-2 border-brand-forest/25 rounded-xl focus:outline-none focus:border-[#164B35] focus:bg-white transition"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpDigits.join("").length !== 6}
                className="w-full py-3.5 px-6 rounded-xl bg-[#164B35] hover:bg-[#0B3024] disabled:opacity-60 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E8B44C]" />
                <span>
                  {verifyingOtp
                    ? "Verifying OTP & Signing In..."
                    : "Verify OTP & Login to Dashboard"}
                </span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-brand-forest/10 text-xs">
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-brand-dark/70 hover:text-brand-forest font-bold inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resendingOtp}
                  className="text-[#164B35] hover:underline disabled:opacity-50 font-extrabold inline-flex items-center gap-1.5"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${resendingOtp ? "animate-spin" : ""}`}
                  />
                  <span>
                    {resendingOtp
                      ? "Sending..."
                      : resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : "Resend OTP Code"}
                  </span>
                </button>
              </div>
            </form>
          ) : mode === "login" ? (
            /* PASSWORDLESS EMAIL + OTP LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest">
                    Email Address *
                  </label>
                  <span className="text-[10px] font-bold text-[#164B35] bg-[#E8B44C]/25 px-2 py-0.5 rounded-full">
                    No password required
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest focus:bg-white"
                    required
                  />
                </div>
                <p className="text-[11px] text-brand-dark/65 mt-1.5">
                  We&apos;ll send a 6-digit One-Time Password (OTP) to your email so you can log in instantly.
                </p>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#164B35] hover:bg-[#0B3024] disabled:opacity-60 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#E8B44C]" />
                <span>
                  {loginLoading ? "Sending OTP to Email..." : "Send Login OTP to Email"}
                </span>
                <ArrowRight className="w-4 h-4 text-[#E8B44C]" />
              </button>

              <div className="pt-4 border-t border-brand-forest/10 text-center space-y-2">
                <p className="text-xs text-brand-dark/70">
                  First time here and want to save your contact details?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-extrabold text-[#164B35] hover:underline"
                  >
                    Create Profile with Email OTP
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* PASSWORDLESS REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sophie Vance"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest">
                    Email Address *
                  </label>
                  <span className="text-[10px] font-bold text-[#164B35] bg-[#E8B44C]/25 px-2 py-0.5 rounded-full">
                    OTP will be sent here
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest focus:bg-white"
                    required
                  />
                </div>
                <p className="text-[11px] text-brand-dark/60 mt-1">
                  Use the same email address you use when booking tours or rides to automatically link all your trips.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-brand-forest/60 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Germany, UK, Sri Lanka"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-forest/20 text-sm text-brand-dark focus:outline-none focus:border-brand-forest focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#164B35] hover:bg-[#0B3024] disabled:opacity-60 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#E8B44C]" />
                <span>
                  {regLoading
                    ? "Sending Verification OTP..."
                    : "Send Email OTP & Continue"}
                </span>
              </button>

              <div className="pt-3 border-t border-brand-forest/10 text-center">
                <p className="text-xs text-brand-dark/70">
                  Already have an account or booked before?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-extrabold text-[#164B35] hover:underline"
                  >
                    Sign In with Email OTP
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

