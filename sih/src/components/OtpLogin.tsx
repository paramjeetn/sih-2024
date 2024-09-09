// src/components/OtpLogin.tsx
"use client";

import { auth } from "@/lib/firebaseConfig";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function OtpLogin() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    };
  }, []);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        await confirmationResult.confirm(otp);
        router.replace("/");
      } catch (error) {
        console.log(error);
        setError("Failed to verify OTP. Please check the OTP.");
      }
    });
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");

      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized.");
      }

      // Prefix the phone number with +91 (India)
      const fullPhoneNumber = `+91${phoneNumber}`;

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          recaptchaVerifier
        );

        setConfirmationResult(confirmationResult);
        setSuccess("OTP sent successfully.");
      } catch (err: any) {
        console.log(err);
        setResendCountdown(0);

        if (err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check the number.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <div className="flex items-center">
            <span className="mr-2 text-lg">+91</span>
            <Input
              className="text-black"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"  // Ensure only 10 digits
              maxLength={10}
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Please enter your 10-digit mobile number (without country code).
          </p>
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      )}

      {confirmationResult && (
        <Input
          className="text-black mt-4"
          type="text"
          maxLength={6}
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />
      )}

      <Button
        onClick={verifyOtp}
        className="mt-4"
        disabled={!confirmationResult || isPending || otp.length < 6}
      >
        {isPending ? "Verifying OTP..." : "Verify OTP"}
      </Button>

      <div className="p-4 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container" />
    </div>
  );
}

export default OtpLogin;
