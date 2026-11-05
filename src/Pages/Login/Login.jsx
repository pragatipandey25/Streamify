import { useState } from "react";
import "./Login.css";
import { useAuth } from "../../context/useAuth";
import { AVATAR_OPTIONS } from "../../context/authConstants";
import Logo from "../../Components/Logo/Logo";

const Login = () => {
  const { login, signup, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].src);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const result = login(email, password);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please verify your password.");
        setLoading(false);
        return;
      }
      const result = signup(name, email, password, selectedAvatar);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    setError("");
    setLoading(true);
    loginWithGoogle();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-wrap">
            <Logo size="large" />
          </div>
          <h2>{mode === "login" ? "Sign in to Streamify" : "Create your Account"}</h2>
          <p className="login-subtitle">
            {mode === "login"
              ? "to continue to Streamify and enjoy high-definition streaming"
              : "join Streamify to watch, subscribe to channels, and join discussions"}
          </p>
        </div>

        {error && <div className="login-alert">{error}</div>}

        <button
          type="button"
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 48 48" width="20" height="20">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="login-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label htmlFor="name-input">Full Name</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Choose Channel Avatar</label>
                <div className="avatar-selector">
                  {AVATAR_OPTIONS.map((opt) => (
                    <img
                      key={opt.id}
                      src={opt.src}
                      alt={opt.name}
                      className={`avatar-option ${selectedAvatar === opt.src ? "selected" : ""}`}
                      onClick={() => setSelectedAvatar(opt.src)}
                      role="button"
                      tabIndex={0}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email-input">Email address</label>
            <input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password-input">Password</label>
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              placeholder={mode === "signup" ? "Create a password (min. 6 chars)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirm-password-input">Confirm Password</label>
              <input
                id="confirm-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="login-footer">
          {mode === "login" ? (
            <p>
              New to Streamify?{" "}
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
