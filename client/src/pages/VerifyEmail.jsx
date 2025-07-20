import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import LoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const codeFromUrl = searchParams.get("code");
  const emailFromUrl = searchParams.get("email");
  const email = emailFromUrl || location.state || "";

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (codeFromUrl) {
      const digits = codeFromUrl.split("").slice(0, 5);
      const newOtp = ["", "", "", "", ""];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
    }
  }, [codeFromUrl]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    if (value && !/[0-9]/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 5).split("");
    
    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 5) {
        newOtp[index] = digit;
      }
    });
    setOtp(newOtp);

    const lastFilledIndex = digits.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
      inputRefs.current[Math.min(lastFilledIndex, 4)]?.focus();
    }
  };

  const handleVerify = useCallback(() => {
    const code = otp.join("");
    
    if (code.length !== 5) {
      setError("Please enter all 5 digits");
      return;
    }

    setLoading(true);
    setError("");
    
    const params = new URLSearchParams({
      code: code,
      email: email.trim()
    });
    
    axios
      .get(`${BASE_URL}/auth/verify?${params.toString()}`)
      .then((res) => {
        if (res.status === 200) {
          navigate("/email-verified");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Invalid verification code");
        setLoading(false);
      });
  }, [otp, email, navigate]);

  const handleResendCode = useCallback(() => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    if (timeLeft > 0) {
      return;
    }

    setResending(true);
    setError("");
    setSuccessMessage("");
    
    axios
      .post(`${BASE_URL}/users/resend-verification`, { email: email.trim() })
      .then((res) => {
        setSuccessMessage("Verification code sent successfully");
        setOtp(["", "", "", "", ""]);
        setTimeLeft(30);
        inputRefs.current[0]?.focus();
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to resend code");
      })
      .finally(() => {
        setResending(false);
      });
  }, [email, timeLeft]);

  useEffect(() => {
    if (codeFromUrl && emailFromUrl) {
      handleVerify();
    }
  }, [codeFromUrl, emailFromUrl, handleVerify]);

  if (error === "Email is already verified") {
    navigate("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a verification code to
          </p>
          {email && (
            <p className="mt-1 text-center text-sm font-medium text-gray-900">
              {email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-5">
                Enter verification code
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`
                      w-14 h-14 text-center text-lg font-semibold text-gray-900
                      border-2 rounded-lg transition-all duration-200
                      ${digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      hover:border-gray-400
                    `}
                  />
                ))}
              </div>
            </div>

            {successMessage && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                onClick={handleVerify}
                disabled={loading || otp.join("").length !== 5}
                className={`
                  w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${loading || otp.join("").length !== 5
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }
                `}
              >
                {loading ? <LoadingSpinner loadingText="Verifying..." /> : "Verify email"}
              </button>
            </div>

            <div className="text-sm text-center">
              <span className="text-gray-600">Didn't receive the code? </span>
              {timeLeft > 0 ? (
                <span className="font-medium text-gray-900">
                  Resend in {timeLeft}s
                </span>
              ) : (
                <button
                  onClick={handleResendCode}
                  disabled={resending}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                >
                  {resending ? "Sending..." : "Resend"}
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Sign up
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Having trouble?{" "}
          <a href="/support" className="font-medium text-blue-600 hover:text-blue-500">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;