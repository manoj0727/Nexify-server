import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signUpAction,
  clearMessage,
  signInAction,
} from "../redux/actions/authActions";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlinePhotograph,
} from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignUpNew = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUpError = useSelector((state) => state.auth?.signUpError);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setAvatar(null);
      setAvatarError(null);
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      setAvatar(null);
      setAvatarError("Please upload a valid image file (jpeg, jpg, png)");
    } else if (file.size > 10 * 1024 * 1024) {
      setAvatar(null);
      setAvatarError("Please upload an image file less than 10MB");
    } else {
      setAvatar(file);
      setAvatarError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingText("Creating your account...");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("role", "general");
    formData.append("isConsentGiven", "false");
    const timeout = setTimeout(() => {
      setLoadingText("Backend waking up — hang tight.");
    }, 5000);
    await dispatch(signUpAction(formData, navigate, false, email));
    setLoading(false);
    clearTimeout(timeout);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setLoadingText("Signing in as demo user...");
    const demoEmail = process.env.REACT_APP_DEMO_EMAIL || "";
    const demoPassword = process.env.REACT_APP_DEMO_PASSWORD || "";
    if (!demoEmail || !demoPassword) {
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("email", demoEmail);
    formData.append("password", demoPassword);
    const timeout = setTimeout(() => {
      setLoadingText("Backend waking up — hang tight.");
    }, 5000);
    await dispatch(signInAction(formData, navigate));
    setLoading(false);
    clearTimeout(timeout);
  };

  const handleClearError = () => dispatch(clearMessage());
  const demoReady =
    process.env.REACT_APP_DEMO_EMAIL && process.env.REACT_APP_DEMO_PASSWORD;

  return (
    <div className="nx-shell relative flex min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-aurora-radial opacity-80" />

      {/* Left marketing panel */}
      <aside className="relative hidden w-1/2 lg:block">
        <div
          className="absolute inset-0 animate-aurora-pan"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #6366F1 100%)",
            backgroundSize: "200% 200%",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-14 text-white">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
            Join Nexify
          </div>
          <div className="max-w-lg">
            <h2 className="text-balance font-display text-5xl font-bold leading-[1.05]">
              A quieter internet, built around your people.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Claim your corner, follow the communities that feel like home, and
              share on your own terms.
            </p>
            <ul className="mt-10 space-y-3 text-white/90">
              {[
                "Context-aware sign-in keeps your account yours.",
                "Smart moderation, not loud outrage.",
                "Communities that actually respond to you.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-white/70">
            © Nexify — built with care.
          </p>
        </div>
      </aside>

      {/* Right form */}
      <div className="relative z-10 flex w-full flex-col px-6 py-10 sm:px-10 lg:w-1/2 lg:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start"
          aria-label="Nexify home"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-aurora shadow-aurora">
            <HiOutlineSparkles className="text-white" />
          </div>
          <span className="nx-wordmark text-2xl font-bold">Nexify</span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="animate-fade-up">
            <span className="nx-chip-aurora mb-5">
              <HiOutlineSparkles className="text-sm" />
              Start free
            </span>
            <h1 className="text-display-md text-balance">
              Create your <span className="nx-wordmark">Nexify</span> profile.
            </h1>
            <p className="mt-3 text-ink-muted">
              One account. Every community. No noise you didn't ask for.
            </p>
          </div>

          {signUpError &&
            Array.isArray(signUpError) &&
            signUpError.map((err, i) => (
              <div
                key={i}
                className="animate-fade-in mt-5 flex items-start gap-3 rounded-md border border-danger/20 bg-danger/5 p-3.5 text-sm"
              >
                <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-danger" />
                <p className="flex-1 text-danger">{err}</p>
                <button
                  onClick={handleClearError}
                  className="rounded p-1 text-danger/70 hover:bg-danger/10 hover:text-danger"
                  aria-label="Dismiss"
                >
                  <RxCross1 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

          <form
            className="mt-8 space-y-5 stagger-fade"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <label htmlFor="name" className="nx-label">
                Username
              </label>
              <div className="nx-input-wrapper">
                <span className="nx-input-icon">
                  <HiOutlineUser className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="nx-input"
                  placeholder="Choose a username"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="nx-label">
                Email
              </label>
              <div className="nx-input-wrapper">
                <span className="nx-input-icon">
                  <HiOutlineMail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="nx-input"
                  placeholder="you@example.com"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="nx-label">
                Password
              </label>
              <div className="nx-input-wrapper">
                <span className="nx-input-icon">
                  <HiOutlineLockClosed className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="nx-input"
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>

            <div>
              <span className="nx-label">Profile photo (optional)</span>
              <label
                htmlFor="avatar"
                className="group flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-line bg-surface-muted p-4 transition-all duration-200 hover:border-brand hover:bg-brand/5"
              >
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-white text-ink-subtle group-hover:text-brand-700 shadow-xs">
                  <HiOutlinePhotograph className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">
                    {avatar ? avatar.name : "Click to upload"}
                  </p>
                  <p className="text-xs text-ink-subtle">PNG or JPG, up to 10MB</p>
                </div>
                <input
                  id="avatar"
                  type="file"
                  className="hidden"
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  autoComplete="off"
                />
              </label>
              {avatarError && (
                <p className="mt-2 text-xs text-danger">{avatarError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="nx-btn-primary w-full py-3 text-sm"
            >
              {loading && !loadingText.toLowerCase().includes("demo") ? (
                <ButtonLoadingSpinner loadingText={loadingText} />
              ) : (
                <>
                  Create account <HiArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {demoReady && (
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="nx-btn-secondary w-full py-3"
              >
                {loading && loadingText.toLowerCase().includes("demo") ? (
                  <ButtonLoadingSpinner loadingText={loadingText} />
                ) : (
                  <>
                    <HiOutlineSparkles className="h-4 w-4" />
                    Try demo account
                  </>
                )}
              </button>
            )}

            <p className="pt-1 text-center text-sm text-ink-muted">
              Already on Nexify?{" "}
              <Link
                to="/signin"
                className="font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpNew;
