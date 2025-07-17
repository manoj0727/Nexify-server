import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import LoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const codeFromUrl = searchParams.get("code");
  const emailFromUrl = searchParams.get("email");
  // Prioritize URL parameter over state to ensure consistency
  const email = emailFromUrl || location.state || "";

  const [code, setCode] = useState(codeFromUrl || "");
  const [error, setError] = useState("");
  
  console.log("Email source - URL:", emailFromUrl, "State:", location.state, "Final:", email);

  const handleCodeChange = (e) => {
    // Only allow numeric input and limit to 5 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCode(value);
  };

  const handleVerify = useCallback(() => {
    setLoading(true);
    // Properly encode URL parameters to handle special characters
    const params = new URLSearchParams({
      code: code.trim(),
      email: email.trim()
    });
    const verificationLink = `${BASE_URL}/auth/verify?${params.toString()}`;
    
    console.log("BASE_URL:", BASE_URL);
    console.log("Verifying with:", { code: code.trim(), email: email.trim() });
    console.log("Full verification link:", verificationLink);
    
    axios
      .get(verificationLink)
      .then((res) => {
        console.log("Success response:", res);
        if (res.status === 200) {
          navigate("/email-verified");
          setCode("");
          setError("");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Verification error:", err);
        console.error("Error response:", err.response);
        console.error("Error data:", err.response?.data);
        console.error("Error status:", err.response?.status);
        
        setError(
          err.response?.data?.message || "Invalid code, please try again."
        );

        setLoading(false);
      });
  }, [code, email, navigate, setLoading, setError]);

  useEffect(() => {
    // Automatically trigger handleVerify if both code and email are present in the URL
    if (codeFromUrl && emailFromUrl) {
      handleVerify();
    }
  }, [codeFromUrl, emailFromUrl, handleVerify]);

  if (error === "Email is already verified") {
    navigate("/signin");
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md transform transition-all">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-center">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Email Verification</h2>
              <p className="text-blue-100 mt-2 text-sm">We've sent a code to your email</p>
            </div>

            {/* Body Section */}
            <div className="p-8">
              {!codeFromUrl && !emailFromUrl && (
                <div className="mb-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Please check your email and enter the 5-digit verification code below
                  </p>
                  {email && (
                    <p className="text-gray-500 text-xs mt-2">
                      Sent to: <span className="font-medium text-gray-700">{email}</span>
                    </p>
                  )}
                </div>
              )}

              {/* OTP Input Section */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="00000"
                    className="w-full px-4 py-3 text-center text-2xl font-semibold tracking-widest border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    value={code}
                    onChange={handleCodeChange}
                    maxLength="5"
                    pattern="[0-9]{5}"
                    style={{ letterSpacing: '0.5em' }}
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2 text-center">
                  Enter the 5-digit code sent to your email
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={loading || code.length !== 5}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    loading || code.length !== 5
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                  onClick={handleVerify}
                >
                  {loading ? (
                    <LoadingSpinner loadingText={"Verifying..."} />
                  ) : (
                    "Verify Email"
                  )}
                </button>
                
                <button
                  className="w-full py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => navigate("/signup")}
                  disabled={loading}
                >
                  Back to Sign Up
                </button>
              </div>

              {/* Resend Code Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{' '}
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Resend Code
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Having trouble? <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
