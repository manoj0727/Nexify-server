import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInAction, clearMessage } from "../redux/actions/authActions";
import { AiFillLinkedin } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineSparkles } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi2";
import ButtonLoadingSpinner from "../components/loader/ButtonLoadingSpinner";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoadingText("Signing in...");
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const timeout = setTimeout(() => {
      setLoadingText(
        "Backend waking up — this can take a few seconds on cold start."
      );
    }, 5000);
    await dispatch(signInAction(formData, navigate));
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
    setEmail(demoEmail);
    setPassword(demoPassword);
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

  const signInError = useSelector((state) => state.auth?.signInError);
  const successMessage = useSelector((state) => state.auth?.successMessage);

  const handleClearMessage = () => dispatch(clearMessage());

  const demoReady =
    process.env.REACT_APP_DEMO_EMAIL && process.env.REACT_APP_DEMO_PASSWORD;

  return (
    <div className="nx-shell relative flex min-h-screen overflow-hidden">
      {/* ambient aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-aurora-radial opacity-80" />
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,24,27,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(24,24,27,0.045) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Left: form */}
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
              Welcome back
            </span>
            <h1 className="text-display-md text-balance">
              Sign in to keep the <span className="nx-wordmark">conversation</span> going.
            </h1>
            <p className="mt-3 text-ink-muted">
              Your communities, posts, and people — right where you left them.
            </p>
          </div>

          {signInError && (
            <div className="animate-fade-in mt-6 flex items-start gap-3 rounded-md border border-danger/20 bg-danger/5 p-3.5 text-sm">
              <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-danger" />
              <p className="flex-1 text-danger">{signInError}</p>
              <button
                onClick={handleClearMessage}
                className="rounded p-1 text-danger/70 hover:bg-danger/10 hover:text-danger"
                aria-label="Dismiss"
              >
                <RxCross1 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="animate-fade-in mt-6 flex items-start gap-3 rounded-md border border-success/20 bg-success/5 p-3.5 text-sm">
              <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-success" />
              <p className="flex-1 text-success">{successMessage}</p>
              <button
                onClick={handleClearMessage}
                className="rounded p-1 text-success/70 hover:bg-success/10 hover:text-success"
                aria-label="Dismiss"
              >
                <RxCross1 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form
            className="mt-8 space-y-5 stagger-fade"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
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
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
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
                  Sign in <HiArrowRight className="h-4 w-4" />
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
              New to Nexify?{" "}
              <Link
                to="/signup"
                className="font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </form>

          <div className="mt-10">
            <div className="nx-divider" />
            <div className="mt-5 flex items-center justify-center gap-5">
              <a
                href="https://www.linkedin.com/in/manoj-kumawat-iiits/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-subtle transition-colors hover:text-brand-700"
                aria-label="LinkedIn"
              >
                <AiFillLinkedin className="h-5 w-5" />
              </a>
              <Link
                to="/admin"
                className="text-ink-subtle transition-colors hover:text-brand-700"
                aria-label="Admin"
              >
                <MdOutlineAdminPanelSettings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right: marketing panel */}
      <aside className="relative hidden w-1/2 lg:block">
        <div
          className="absolute inset-0 animate-aurora-pan"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #6366F1 0%, #8B5CF6 45%, #EC4899 100%)",
            backgroundSize: "200% 200%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.25), transparent 30%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.18), transparent 35%)",
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
            Live communities
          </div>

          <div className="max-w-lg">
            <h2 className="text-balance font-display text-5xl font-bold leading-[1.05]">
              Where ideas find their people.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Nexify brings together thoughtful communities, expressive posts,
              and context-aware trust — so every conversation feels like it
              belongs.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-5 text-sm">
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <div className="font-display text-2xl font-bold">12k+</div>
                <div className="text-white/75">Members</div>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <div className="font-display text-2xl font-bold">48</div>
                <div className="text-white/75">Communities</div>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <div className="font-display text-2xl font-bold">99.9%</div>
                <div className="text-white/75">Uptime</div>
              </div>
            </div>
          </div>

          <figure className="max-w-md text-sm text-white/80">
            <p className="italic text-white/90">
              "The calmest social feed I've used in years. It just gets out of
              the way."
            </p>
            <figcaption className="mt-2 font-medium text-white">
              — Early user
            </figcaption>
          </figure>
        </div>
      </aside>
    </div>
  );
};

export default SignIn;
