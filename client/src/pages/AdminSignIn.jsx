import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/Nexify.png";
import { useState } from "react";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";
import { IoIosArrowRoundBack } from "react-icons/io";
import { signInAction } from "../redux/actions/adminActions";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const AdminSignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const signInError = useSelector((state) => state.admin?.signInError);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    setSigningIn(true);
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    dispatch(signInAction(data)).then(() => {
      setSigningIn(false);
      navigate("/admin");
    });
  };

  const handleClearError = () => {
    // You may need to dispatch a clear error action here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Admin Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-full p-4">
              <MdOutlineAdminPanelSettings className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white border-opacity-20">
            <div className="p-8">
              <div className="text-center">
                <img className="mx-auto h-10 w-auto" src={logo} alt="Nexify" />
                <h2 className="mt-6 text-3xl font-bold text-white">
                  Admin Portal
                </h2>
                <p className="mt-2 text-sm text-gray-300">
                  Sign in to access the admin dashboard
                </p>
              </div>

              {signInError && (
                <div className="mt-6 relative rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-red-300">{signInError}</p>
                    </div>
                    <button
                      className="ml-auto text-red-400 hover:text-red-300"
                      onClick={handleClearError}
                    >
                      <RxCross1 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                      Username
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        className="block w-full pl-10 pr-3 py-3 bg-white bg-opacity-10 border border-gray-300 border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-white transition duration-150"
                        placeholder="Enter admin username"
                        required
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="block w-full pl-10 pr-3 py-3 bg-white bg-opacity-10 border border-gray-300 border-opacity-30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-white transition duration-150"
                        placeholder="Enter admin password"
                        required
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={signingIn}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
                      signingIn ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {signingIn ? (
                      <ButtonLoadingSpinner loadingText={"Signing in..."} />
                    ) : (
                      "Sign in as Admin"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link 
                    to="/" 
                    className="text-sm text-gray-300 hover:text-white transition duration-150 flex items-center justify-center"
                  >
                    <IoIosArrowRoundBack className="mr-2 h-5 w-5" />
                    Back to home
                  </Link>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 bg-opacity-50 text-gray-400">Admin access only</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-400">
                    This area is restricted to authorized administrators only.
                    Unauthorized access attempts will be logged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;