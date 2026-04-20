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

      {/* Left editorial marketing panel */}
      <aside
        className="relative hidden w-1/2 lg:block"
        style={{ backgroundColor: "#222222" }}
      >
        <div
          className="absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ backgroundColor: "#FA8112", opacity: 0.32 }}
        />
        <div
          className="absolute -left-24 -bottom-24 h-[360px] w-[360px] rounded-full blur-3xl"
          style={{ backgroundColor: "#F5E7C6", opacity: 0.08 }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(250,243,225,0.22) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          }}
        />
        <div
          className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14"
          style={{ color: "#FAF3E1" }}
        >
          <div
            className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em]"
            style={{ color: "rgba(250,243,225,0.75)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse-soft"
              style={{ backgroundColor: "#FA8112" }}
            />
            Join Nexify
          </div>
          <div className="max-w-lg">
            <h2 className="text-balance font-display text-5xl font-bold leading-[1.05]">
              A quieter internet, built around{" "}
              <span style={{ color: "#FA8112" }}>your people</span>.
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: "rgba(250,243,225,0.78)" }}
            >
              Claim your corner, follow the communities that feel like home, and
              share on your own terms.
            </p>
            <ul className="mt-10 space-y-3" style={{ color: "rgba(250,243,225,0.9)" }}>
              {[
                "Context-aware sign-in keeps your account yours.",
                "Smart moderation, not loud outrage.",
                "Communities that actually respond to you.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "#FA8112" }}
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm" style={{ color: "rgba(250,243,225,0.6)" }}>
            © Nexify — built with care.
          </p>
        </div>
      </aside>

      {/* Right form */}
      <div className="relative z-10 flex w-full flex-col px-6 py-10 sm:px-10 lg:w-1/2 lg:px-8 xl:px-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-start"
          aria-label="Nexify home"
        >
          <div
            className="grid h-9 w-9 place-items-center rounded-xl shadow-ember"
            style={{ backgroundColor: "#222222" }}
          >
            <HiOutlineSparkles style={{ color: "#FA8112" }} />
          </div>
          <span className="nx-wordmark nx-brand-lockup text-2xl">Nexify</span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="animate-fade-up">
            <span className="nx-chip-ember mb-5">
              <HiOutlineSparkles className="text-sm" />
              Start free
            </span>
            <h1 className="text-display-md text-balance">
              Create your{" "}
              <span className="nx-underline">Nexify</span> profile.
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
